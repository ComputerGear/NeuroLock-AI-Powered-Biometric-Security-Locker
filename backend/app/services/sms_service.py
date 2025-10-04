from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

from app.core.config import settings

# Initialize the Twilio Client
try:
    twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    verify_service = twilio_client.verify.v2.services(settings.TWILIO_VERIFY_SID)
except Exception as e:
    print(f"Error initializing Twilio client: {e}")
    twilio_client = None
    verify_service = None

def send_sms(phone_number: str, message: str) -> bool:
    """
    Sends a standard SMS message to a given phone number.
    """
    if not twilio_client:
        print("Twilio client not initialized. Cannot send SMS.")
        return False
        
    try:
        twilio_client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        print(f"SMS sent to {phone_number}")
        return True
    except TwilioRestException as e:
        print(f"Error sending SMS to {phone_number}: {e}")
        return False

def send_otp(phone_number: str) -> bool:
    """
    Sends an OTP to the user's phone number using Twilio Verify.
    """
    if not verify_service:
        print("Twilio Verify service not initialized. Cannot send OTP.")
        return False

    try:
        verify_service.verifications.create(to=phone_number, channel='sms')
        print(f"OTP sent to {phone_number}")
        return True
    except TwilioRestException as e:
        print(f"Error sending OTP to {phone_number}: {e}")
        return False

def verify_otp(phone_number: str, otp_code: str) -> bool:
    """
    Verifies an OTP code for a given phone number using Twilio Verify.
    """
    if not verify_service:
        print("Twilio Verify service not initialized. Cannot verify OTP.")
        return False
        
    try:
        result = verify_service.verification_checks.create(to=phone_number, code=otp_code)
        return result.status == 'approved'
    except TwilioRestException as e:
        print(f"Error verifying OTP for {phone_number}: {e}")
        return False