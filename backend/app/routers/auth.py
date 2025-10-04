from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

# --- CHANGE IS HERE ---
# Import the specific crud module you need
from app.crud import crud_user 
from app import models, schemas
# --- END CHANGE ---

from app.schemas.user import User, UserCreate, Token 
from app.database.session import SessionLocal
from app.security import create_access_token, verify_password
from app.services import sms_service # <--- Add this import
from pydantic import BaseModel

router = APIRouter()


# --- ADD THESE NEW PYDANTIC MODELS ---
class PhoneRequest(BaseModel):
    phone_number: str

class OtpVerifyRequest(BaseModel):
    phone_number: str
    otp: str
# --- END NEW MODELS ---


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ADD THIS NEW ENDPOINT ---
@router.post("/auth/send-otp")
def send_otp(request: PhoneRequest):
    phone = request.phone_number.strip()
    
    # Normalize phone number to E.164 format for Twilio
    if len(phone) == 10 and phone.isdigit():
        formatted_phone = f"+91{phone}"
    elif phone.startswith('+91'):
        formatted_phone = phone
    else:
        raise HTTPException(status_code=400, detail="Invalid phone number format.")

    success = sms_service.send_otp(formatted_phone)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send OTP.")
    return {"message": "OTP sent successfully"}
# --- END NEW ENDPOINT ---

# --- ADD THIS NEW ENDPOINT ---
@router.post("/auth/verify-otp")
def verify_otp(request: OtpVerifyRequest):
    # (Normalization logic can be repeated here for verification if needed)
    is_valid = sms_service.verify_otp(phone_number=request.phone_number, otp_code=request.otp)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP.")
    return {"message": "OTP verified successfully", "verified": True}
# --- END NEW ENDPOINT ---

@router.post("/register", response_model=User)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # --- CHANGE IS HERE ---
    # Use the specific module to call the function
    db_user = crud_user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = crud_user.create_user(db=db, user=user)
    # --- END CHANGE ---

    return new_user


@router.post("/login", response_model=Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # --- CHANGE IS HERE ---
    user = crud_user.get_user_by_email(db, email=form_data.username)
    # --- END CHANGE ---
    if not user or not user.password_hash or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}