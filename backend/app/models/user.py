# backend/app/models/user.py

import enum
from datetime import datetime
from app.database.session import Base

from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Enum,
    BLOB,
    JSON
)
from sqlalchemy.orm import relationship

# Import the Base class from your database session setup
from app.database.session import Base

# Using Enums makes the data more robust and readable
class UserStatus(enum.Enum):
    PENDING_APPROVAL = "PENDING_APPROVAL"
    PENDING_PAYMENT = "PENDING_PAYMENT"
    ACTIVE = "ACTIVE"
    REJECTED = "REJECTED"

class SubscriptionPlan(enum.Enum):
    BASIC = "Basic"
    SILVER = "Silver"
    GOLD = "Gold"
    PLATINUM = "Platinum"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone_number = Column(String(20), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True) # Nullable until activated
    
    # Use JSON to store the list of numbers for the vector embedding
    face_embedding = Column(JSON, nullable=True) 
    
    bank_account_no = Column(String(50), nullable=False)
    ifsc_code = Column(String(20), nullable=False)
    branch_name = Column(String(100), nullable=False)

    status = Column(Enum(UserStatus), default=UserStatus.PENDING_APPROVAL, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # BLOB to temporarily store the image for admin review
    image_blob = Column(BLOB, nullable=True)

    # --- Relationships ---
    # `back_populates` creates a two-way link between the related models
    # `uselist=False` defines a one-to-one relationship
    locker = relationship("Locker", back_populates="user", uselist=False, cascade="all, delete-orphan")
    nominees = relationship("Nominee", back_populates="user", cascade="all, delete-orphan")
    access_logs = relationship("AccessLog", back_populates="user", cascade="all, delete-orphan")


class Locker(Base):
    __tablename__ = "lockers"

    id = Column(Integer, primary_key=True, index=True)
    locker_number = Column(String(20), unique=True, nullable=False)
    pin_hash = Column(String(255), nullable=False)
    subscription_plan = Column(Enum(SubscriptionPlan), nullable=False)
    tenure_years = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)

    # Foreign key to link this locker to a user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    
    # --- Relationship ---
    user = relationship("User", back_populates="locker")


class Nominee(Base):
    __tablename__ = "nominees"

    id = Column(Integer, primary_key=True, index=True)
    nominee_name = Column(String(100), nullable=False)
    user_relationship = Column(String(50), nullable=False)

    # Foreign key to link this nominee to a user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # --- Relationship ---
    user = relationship("User", back_populates="nominees")


class AccessLog(Base):
    __tablename__ = "access_logs"

    id = Column(Integer, primary_key=True, index=True)
    access_time = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="SUCCESS")

    # Foreign key to link this log entry to a user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # --- Relationship ---
    user = relationship("User", back_populates="access_logs")