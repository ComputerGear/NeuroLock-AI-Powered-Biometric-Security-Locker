import razorpay
from app.core.config import settings

# Initialize the Razorpay Client
try:
    razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
except Exception as e:
    print(f"Error initializing Razorpay client: {e}")
    razorpay_client = None

def create_payment_link(amount: int, description: str, user_email: str, user_phone: str) -> str | None:
    """
    Creates a Razorpay payment link.
    Amount should be in the smallest currency unit (e.g., paise for INR).
    """
    if not razorpay_client:
        print("Razorpay client not initialized. Cannot create payment link.")
        return None

    try:
        link_payload = {
            "amount": amount,
            "currency": "INR",
            "accept_partial": False,
            "description": description,
            "customer": {
                "name": user_email, # Using email as a placeholder for name
                "email": user_email,
                "contact": user_phone
            },
            "notify": {
                "sms": True,
                "email": True
            },
            "reminder_enable": True,
            # URL to redirect the user to after payment.
            # Replace with your actual frontend success page URL.
            "callback_url": "http://localhost:5173/payment-success",
            "callback_method": "get"
        }
        
        payment_link = razorpay_client.payment_link.create(link_payload)
        return payment_link['short_url']
        
    except Exception as e:
        print(f"Error creating Razorpay payment link: {e}")
        return None