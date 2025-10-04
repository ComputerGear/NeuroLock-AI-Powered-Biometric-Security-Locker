from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models
# Import the specific schemas you need from the user.py file
from app.schemas.user import LockerSetPin, UnlockRequest
from app.database.session import SessionLocal
# NOTE: 'get_current_active_user' is a dependency from security.py that ensures
# the user is logged in and their account status is 'ACTIVE'.
from app.security import get_current_active_user
from app.services import sms_service

router = APIRouter()

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/locker/set-pin", status_code=status.HTTP_200_OK)
def set_locker_pin(
    pin_data: LockerSetPin,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_active_user)
):
    """
    Allows an active user to set their 6-digit locker PIN for the first time.
    """
    if current_user.locker and current_user.locker.pin_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="PIN has already been set. Please use the reset PIN feature."
        )
    
    if not (pin_data.pin.isdigit() and len(pin_data.pin) == 6):
         raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="PIN must be a 6-digit number."
        )

    crud.set_locker_pin(db=db, user=current_user, pin=pin_data.pin)
    
    return {"message": "Locker PIN set successfully."}

@router.post("/locker/unlock", status_code=status.HTTP_200_OK)
def unlock_locker(
    unlock_data: UnlockRequest, # Assumes UnlockRequest schema exists
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_active_user)
):
    """
    Final step to unlock the locker.
    Verifies the user's PIN and a one-time password (OTP) that was
    sent to their phone after a successful face verification.
    """
    # 1. Verify the OTP
    is_otp_valid = sms_service.verify_otp(
        phone_number=current_user.phone_number, 
        otp_code=unlock_data.otp
    )
    if not is_otp_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP.")

    # 2. Verify the Locker PIN
    is_pin_valid = crud.verify_locker_pin(db=db, user=current_user, pin=unlock_data.pin)
    if not is_pin_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid locker PIN.")

    # 3. If both are valid, log the access
    crud.create_access_log(db=db, user=current_user)

    return {"message": "Locker unlocked successfully."}