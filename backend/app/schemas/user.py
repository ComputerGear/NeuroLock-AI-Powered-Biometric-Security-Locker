from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Import the Enums from your models to ensure consistency
from app.models.user import UserStatus, SubscriptionPlan


# ===================================================================
# Schemas for Nominee
# ===================================================================

# Base schema with common attributes for a nominee
class NomineeBase(BaseModel):
    nominee_name: str
    user_relationship: str

# Schema for creating a new nominee (what the API receives)
class NomineeCreate(NomineeBase):
    pass

# Schema for reading a nominee (what the API sends back)
# This includes database-generated fields like id.
class Nominee(NomineeBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True # Allows the model to be created from ORM objects


# ===================================================================
# Schemas for Locker
# ===================================================================

# Base schema with common attributes for a locker
class LockerBase(BaseModel):
    locker_number: str
    subscription_plan: SubscriptionPlan
    tenure_years: int

# Schema for the API response when reading locker data
class Locker(LockerBase):
    id: int
    is_active: bool
    user_id: int

    class Config:
        from_attributes = True

# Schema for when a user sets their locker PIN
class LockerSetPin(BaseModel):
    pin: str


# ===================================================================
# Schemas for User
# ===================================================================

# Base schema with common user attributes
class UserBase(BaseModel):
    full_name: str
    email: EmailStr # Pydantic automatically validates this is a valid email format
    phone_number: str
    bank_account_no: str
    ifsc_code: str
    branch_name: str

# Schema for the initial user registration form
# This includes details needed to create both the User and their Locker subscription
class UserCreate(UserBase):
    subscription_plan: SubscriptionPlan
    tenure_years: int
    # The frontend will send the captured face image as a Base64 encoded string
    image_base64: str

# Schema for the API response when reading a user's data
# This is the "public" view of a user, excluding sensitive data.
class User(UserBase):
    id: int
    status: UserStatus
    created_at: datetime
    
    # These fields will be populated from the database relationships
    locker: Optional[Locker] = None
    nominees: List[Nominee] = []

    class Config:
        from_attributes = True

# ADD THIS NEW SCHEMA
# Schema for the request body when a user unlocks their locker
class UnlockRequest(BaseModel):
    pin: str
    otp: str

# ===================================================================
# Schemas for Authentication
# ===================================================================

# Schema for the JWT token response after a successful login
class Token(BaseModel):
    access_token: str
    token_type: str

# Schema for the data encoded within the JWT
class TokenData(BaseModel):
    email: Optional[str] = None

# ... other imports ...
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# ... other schemas ...

# ===================================================================
# Schemas for Admin Dashboard
# ===================================================================

# A simplified user schema for nesting in other models
class UserSimple(BaseModel):
    id: int
    full_name: str
    email: str
    
    class Config:
        from_attributes = True

# Schema for a single access log entry in the response
class AccessLogResponse(BaseModel):
    id: int
    access_time: datetime
    user: UserSimple # Nest the user details

    class Config:
        from_attributes = True

# Schema for the dashboard statistics response
class DashboardStats(BaseModel):
    pending_count: int
    active_users_count: int
    total_users_count: int