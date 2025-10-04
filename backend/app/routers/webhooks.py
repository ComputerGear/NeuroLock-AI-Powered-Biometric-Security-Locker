from fastapi import APIRouter, Request, Header, HTTPException, status, Depends
import razorpay
from typing import Optional
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import SessionLocal
# --- ADD THESE IMPORTS ---
from app import crud, models
from app.services import sms_service
# --- END ADDITION ---

router = APIRouter()

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/webhooks/razorpay")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Handles incoming webhooks from Razorpay to confirm payment success.
    """
    if x_razorpay_signature is None:
        raise HTTPException(status_code=400, detail="X-Razorpay-Signature header not found")

    body = await request.body()
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    try:
        client.utility.verify_webhook_signature(
            body.decode('utf-8'),
            x_razorpay_signature,
            settings.RAZORPAY_WEBHOOK_SECRET
        )
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Razorpay signature verification failed")

    payload = await request.json()
    event = payload.get("event")

    if event == "payment.captured":
        # --- COMPLETE BUSINESS LOGIC ---
        
        # 1. Extract user email from the payload.
        user_email = payload['payload']['payment']['entity']['email']
        
        # 2. Find the user in your database.
        db_user = crud.crud_user.get_user_by_email(db, email=user_email)
        if not db_user:
            print(f"Webhook received for non-existent user: {user_email}")
            return {"status": "error", "detail": "User not found"}
        
        # 3. Update their status to 'ACTIVE'. 🔄
        crud.crud_user.update_user_status(db, user=db_user, new_status=models.user.UserStatus.ACTIVE)
        
        # 4. Generate, save, and get their temporary password. 🔑
        temp_password = crud.crud_user.set_temporary_password(db, user=db_user)
        
        # 5. Send the password via SMS.
        sms_service.send_sms(
            phone_number=db_user.phone_number,
            message=f"Payment successful! Your LockSafe temporary password is: {temp_password}"
        )
        
        # 6. Generate and store the face embedding, then delete the original image. 👤
        crud.crud_user.finalize_face_embedding(db, user=db_user)

        print(f"User {user_email} successfully activated.")
        # --- END OF BUSINESS LOGIC ---
        
    return {"status": "ok"}