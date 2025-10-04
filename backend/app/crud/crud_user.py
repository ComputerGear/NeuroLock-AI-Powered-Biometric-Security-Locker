import base64
from sqlalchemy.orm import Session

# Import the specific models and schemas needed
from app.models.user import User,UserStatus
from app.schemas.user import UserCreate
from app.security import get_password_hash
# --- ADD THIS IMPORT ---
# Import the locker creation function
from app.crud import crud_locker
# --- END ADDITION ---

# --- ADD THESE IMPORTS ---
from app.services import face_service


def get_user_by_email(db: Session, email: str) -> User | None:
    """
    Retrieves a single user from the database by their email address.
    """
    return db.query(User).filter(User.email == email).first()

# --- ADD THIS NEW FUNCTION ---
def get_user_by_id(db: Session, user_id: int) -> User | None:
    """
    Retrieves a single user from the database by their ID.
    """
    return db.query(User).filter(User.id == user_id).first()
# --- END NEW FUNCTION ---


# --- ADD THIS NEW FUNCTION ---
def get_users_by_status(db: Session, status: UserStatus) -> list[User]:
    """
    Retrieves all users from the database who have a specific status.
    """
    return db.query(User).filter(User.status == status).all()
# --- END NEW FUNCTION ---


# backend/app/crud/crud_user.py

# ... (imports and other functions like get_user_by_id) ...

# --- ADD THIS NEW FUNCTION ---
def update_user_status(db: Session, user: User, new_status: UserStatus) -> User:
    """
    Updates the status of a given user.
    """
    user.status = new_status
    db.commit()
    db.refresh(user)
    return user
# --- END NEW FUNCTION ---

# ... (rest of the file)
def create_user(db: Session, user: UserCreate) -> User:
    """
    Creates a new user record in the database.
    """
    # Decode the Base64 image and store it as a BLOB
    image_data = base64.b64decode(user.image_base64.split(',')[1])

    db_user = User(
        email=user.email,
        full_name=user.full_name,
        phone_number=user.phone_number,
        bank_account_no=user.bank_account_no,
        ifsc_code=user.ifsc_code,
        branch_name=user.branch_name,
        image_blob=image_data,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
     # --- ADD THIS LOGIC ---
    # After creating the user, immediately create their locker record
    crud_locker.create_user_locker(
        db=db,
        user=db_user,
        subscription_plan=user.subscription_plan,
        tenure_years=user.tenure_years
    )
    # --- END ADDITION ---
    return db_user



import secrets
import string

def update_user_status(db: Session, user: User, new_status: UserStatus) -> User:
    """Updates the status of a user in the database."""
    user.status = new_status
    db.commit()
    db.refresh(user)
    return user

def set_temporary_password(db: Session, user: User) -> str:
    """Generates a random password, hashes it, saves it to the DB, and returns the plain text version."""
    alphabet = string.ascii_letters + string.digits
    temp_password = ''.join(secrets.choice(alphabet) for i in range(8))
    
    user.password_hash = get_password_hash(temp_password)
    db.commit()
    db.refresh(user)
    
    # Return the plain text password to be sent via SMS
    return temp_password
    
def finalize_face_embedding(db: Session, user: User):
    """
    Retrieves the user's stored image blob, generates a face embedding,
    saves the embedding, and deletes the original image blob.
    """
    if user.image_blob:
        embedding = face_service.generate_embedding(user.image_blob)
        if embedding:
            user.face_embedding = embedding
            user.image_blob = None # Clear the original image for privacy and to save space
            db.commit()
            db.refresh(user)
            print(f"Face embedding generated and stored for user {user.email}")
        else:
            print(f"Could not generate face embedding for user {user.email}")
# --- END ADDITION ---