import base64
import numpy as np
import cv2
from deepface import DeepFace
from sqlalchemy.orm import Session

# Correctly import the 'user' module from the 'models' package
from app import models

def _decode_image(image_base64: str) -> np.ndarray | None:
    """Helper function to decode a base64 string into a CV2 image."""
    try:
        # Split the header from the data
        img_data = base64.b64decode(image_base64.split(',')[1])
        # Convert to a numpy array
        np_arr = np.frombuffer(img_data, np.uint8)
        # Decode the array into an image (in BGR format for CV2)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(f"Error decoding base64 image: {e}")
        return None

def generate_embedding(image_blob: bytes) -> list[float] | None:
    """
    Generates a facial vector embedding from an image provided as bytes.
    Uses VGG-Face model for consistent embeddings.
    """
    try:
        # Decode the image bytes into a numpy array
        np_arr = np.frombuffer(image_blob, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        # Use DeepFace to represent the face as a vector
        embedding_obj = DeepFace.represent(
            img_path=img,
            model_name='VGG-Face',
            enforce_detection=True # Fails if no face is found
        )
        return embedding_obj[0]['embedding']
    except ValueError as e:
        print(f"Face not detected or error in embedding generation: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred during embedding generation: {e}")
        return None


def find_matching_user(db: Session, target_embedding: list[float], threshold: float = 0.40) -> models.user.User | None:
    """
    Finds a user in the database whose stored face embedding matches a target embedding.
    Uses Cosine Distance. A lower distance means a better match.
    """

    # Fetch all active users who have a face embedding stored
    # Corrected the references from models.User to models.user.User
    users_with_embeddings = db.query(models.user.User).filter(
        models.user.User.face_embedding.isnot(None),
        models.user.User.status == models.user.UserStatus.ACTIVE
    ).all()

    target_np = np.array(target_embedding)

    for user in users_with_embeddings:
        stored_np = np.array(user.face_embedding)
        
        # Calculate Cosine Distance
        dot_product = np.dot(stored_np, target_np)
        norm = np.linalg.norm(stored_np) * np.linalg.norm(target_np)
        similarity = dot_product / norm
        distance = 1 - similarity

        if distance <= threshold:
            print(f"Match found for user ID {user.id} with distance {distance}")
            return user
            
    print("No matching user found.")
    return None