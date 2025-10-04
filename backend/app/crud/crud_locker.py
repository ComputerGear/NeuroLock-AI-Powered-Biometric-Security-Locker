from sqlalchemy.orm import Session
import random

from app import models
from app.security import get_password_hash, verify_password

def create_user_locker(
    db: Session, 
    user: models.user.User, 
    subscription_plan: models.user.SubscriptionPlan, 
    tenure_years: int
) -> models.user.Locker:
    """
    Creates a new Locker record and associates it with a user upon registration.
    """
    # Generate a unique locker number. A real system might have a pool of available numbers.
    locker_number = f"A-{1000 + user.id}"

    # The user will set their real PIN after activation. This is a secure placeholder.
    placeholder_pin = get_password_hash(str(random.getrandbits(128)))

    db_locker = models.user.Locker(
        user_id=user.id,
        locker_number=locker_number,
        pin_hash=placeholder_pin,
        subscription_plan=subscription_plan,
        tenure_years=tenure_years,
        is_active=False # Locker becomes active after payment and PIN set
    )
    db.add(db_locker)
    db.commit()
    db.refresh(db_locker)
    return db_locker

def set_locker_pin(db: Session, user: models.user.User, pin: str) -> models.user.Locker:
    """
    Updates the user's locker with a new, hashed PIN.
    """
    if not user.locker:
        # This case should ideally not be reached if the application flow is correct
        raise ValueError("User does not have a locker assigned.")
    
    hashed_pin = get_password_hash(pin)
    user.locker.pin_hash = hashed_pin
    user.locker.is_active = True # The locker is now fully active
    db.commit()
    db.refresh(user.locker)
    return user.locker

def verify_locker_pin(db: Session, user: models.user.User, pin: str) -> bool:
    """
    Verifies if the provided plain-text PIN matches the user's stored hashed PIN.
    """
    if not user.locker or not user.locker.pin_hash:
        return False
    
    return verify_password(pin, user.locker.pin_hash)

def create_access_log(db: Session, user: models.user.User) -> models.user.AccessLog:
    """
    Creates a new AccessLog entry for a user upon successful locker unlock.
    """
    db_log = models.user.AccessLog(user_id=user.id, status="SUCCESS")
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log