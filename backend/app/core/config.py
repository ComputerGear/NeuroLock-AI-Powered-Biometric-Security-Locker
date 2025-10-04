from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # --- Database Configuration ---
    DATABASE_URL: str

    # --- JWT Security Configuration ---
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # --- Twilio SMS/OTP Configuration ---
    TWILIO_ACCOUNT_SID: str
    TWILIO_AUTH_TOKEN: str
    TWILIO_PHONE_NUMBER: str
    TWILIO_VERIFY_SID: str # For the OTP Verification service

    # --- Razorpay Payment Gateway Configuration ---
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    RAZORPAY_WEBHOOK_SECRET: str # To secure your webhook endpoint
    
    ADMIN_EMAIL: str # <-- ADD THIS LINE
    ADMIN_PASSWORD: str # <-- ADD THIS LINE

    class Config:
        # This tells Pydantic to load the variables from the .env file
        env_file = ".env"

# Create a single, importable instance of the settings
settings = Settings()