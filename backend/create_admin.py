from app.database.session import SessionLocal
from app.models.user import User, UserStatus
from app.core.config import settings
from app.security import get_password_hash

def create_admin_user():
    """
    Creates the admin user based on the details in the .env file.
    This script is non-interactive.
    """
    db = SessionLocal()
    try:
        # Check if the admin user already exists
        admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if admin_user:
            print(f"Admin user with email '{settings.ADMIN_EMAIL}' already exists.")
            return

        print("--- Creating Admin User ---")
        
        # Get the pre-defined password from settings and hash it
        password = settings.ADMIN_PASSWORD
        hashed_password = get_password_hash(password)

        # Create the admin user with placeholder details
        new_admin = User(
            full_name="Administrator",
            email=settings.ADMIN_EMAIL,
            phone_number="0000000000",
            password_hash=hashed_password,
            bank_account_no="N/A",
            ifsc_code="N/A",
            branch_name="N/A",
            status=UserStatus.ACTIVE # Admin must be active immediately
        )
        
        db.add(new_admin)
        db.commit()
        
        print(f"Admin user '{settings.ADMIN_EMAIL}' created successfully!")

    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()