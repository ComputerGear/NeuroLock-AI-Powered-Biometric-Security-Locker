from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models
from app.schemas import user as user_schemas # Import the user module from schemas
from app.database.session import SessionLocal
# NOTE: The 'get_current_admin_user' is a dependency you would create in security.py
# It would verify the JWT and check if the user has an 'admin' role.
from app.security import get_current_admin_user 
from app.services import payment_service, sms_service

router = APIRouter()

# Add OAuth2PasswordRequestForm to your imports at the top
from fastapi.security import OAuth2PasswordRequestForm
# Add security functions to your imports
from app.security import verify_password, create_access_token
from app.schemas.user import Token # Import the Token schema
from app.core.config import settings
from datetime import timedelta
# --- CHANGE IS HERE ---
from app.crud import crud_user, crud_admin # Import both specific modules
from app import models
# --- END CHANGE ---
# ... other code in admin.py ...
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/admin/login", response_model=Token)
def admin_login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # Admin validation logic
    admin_user = crud_user.get_user_by_email(db, email=form_data.username)

    # Check if the user is the designated admin and password is correct
    if (not admin_user or 
        admin_user.email != settings.ADMIN_EMAIL or 
        not verify_password(form_data.password, admin_user.password_hash)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect admin credentials"
        )
    
    access_token = create_access_token(data={"sub": admin_user.email})
    return {"access_token": access_token, "token_type": "bearer"}
# Dependency to get a DB session


@router.get("/admin/pending-requests", response_model=List[user_schemas.User])
def get_pending_applications(
    db: Session = Depends(get_db),
    current_admin: models.user.User = Depends(get_current_admin_user)
):
    """
    Retrieves a list of all user applications with 'PENDING_APPROVAL' status.
    Accessible only by an admin user.
    """
    pending_users = crud_user.get_users_by_status(db, status= models.user.UserStatus.PENDING_APPROVAL)
    return pending_users

@router.put("/admin/approve/{user_id}", response_model=user_schemas.User)
def approve_application(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: models.user.User = Depends(get_current_admin_user)
):
    """
    Approves a user's application.
    This changes the user's status to 'PENDING_PAYMENT' and sends them a payment link.
    Accessible only by an admin user.
    """
    db_user = crud_user.get_user_by_id(db, user_id=user_id)
    
    
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if db_user.status != models.user.UserStatus.PENDING_APPROVAL:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User is not pending approval. Current status: {db_user.status.value}"
        )
    
      # --- CHANGE IS HERE ---
    # Call the function from the correct crud_user module
    updated_user = crud_user.update_user_status(db, user=db_user, new_status=models.user.UserStatus.PENDING_PAYMENT)
    # --- END CHANGE ---

    # --- Trigger Business Logic ---
    # # 1. Update user status in the database
    # updated_user = crud.update_user_status(db, user=db_user, new_status=models.user.UserStatus.PENDING_PAYMENT)
    
    # 2. Generate a payment link via Razorpay
    # In a real app, you would get the amount from the user's chosen subscription plan
    payment_link = payment_service.create_payment_link(
        amount=500000, # Example: 5000.00 INR in paise
        description=f"Payment for {updated_user.locker.subscription_plan.value} Locker Plan",
        user_email=updated_user.email,
        user_phone=updated_user.phone_number
    )

    # 3. Send the payment link to the user via SMS
    message = (
        f"Your LockSafe application has been approved! "
        f"Please complete your payment using this link: {payment_link}"
    )
    sms_service.send_sms(phone_number=updated_user.phone_number, message=message)
    
    return updated_user

# ... other imports ...
# Update schema imports
from app.schemas.user import User as UserSchema, DashboardStats, AccessLogResponse
# Import the new crud file
from app.crud import crud_admin

# ... router setup and get_db dependency ...

@router.get("/admin/stats", response_model=DashboardStats)
def get_stats(
    db: Session = Depends(get_db),
    current_admin: models.user.User = Depends(get_current_admin_user)
):
    """
    Endpoint to retrieve statistics for the admin dashboard.
    """
    stats = crud_admin.get_dashboard_stats(db)
    return stats

@router.get("/admin/access-logs", response_model=List[AccessLogResponse])
def get_user_access_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: models.user.User = Depends(get_current_admin_user)
):
    """
    Endpoint to retrieve all user access logs with pagination.
    """
    logs = crud_admin.get_access_logs(db, skip=skip, limit=limit)
    return logs

# ... existing /admin/pending-requests and /admin/approve/{user_id} endpoints ...