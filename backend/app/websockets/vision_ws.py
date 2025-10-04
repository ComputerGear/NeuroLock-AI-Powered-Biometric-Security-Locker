from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
import base64
import numpy as np
import cv2

from app.database.session import SessionLocal
from app.vision.liveness_detector import LivenessDetector
from app.services import face_service, sms_service

router = APIRouter()

# WebSocket endpoints don't support standard dependency injection with `Depends`,
# so we manage the database session manually.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.websocket("/ws/vision/{task}")
async def vision_websocket(websocket: WebSocket, task: str):
    """
    Handles real-time vision tasks.
    - task='register': Performs a liveness check only.
    - task='verify': Performs a liveness check, then face verification, and sends an OTP.
    """
    await websocket.accept()
    detector = LivenessDetector()
    db_generator = get_db()
    db = next(db_generator)

    try:
        frame_count = 0
        while True:
            frame_count += 1
            data = await websocket.receive_text()
            frame = face_service._decode_image(data) # Use the decoding helper from face_service
            
            if frame is None:
                continue

            # Process frame for liveness metrics
            liveness_results = detector.analyze_frame(frame)

            # Check for a final decision after a certain number of frames
            if frame_count > 60: # Approx. 3 seconds if frontend sends at 20fps
                confidence, reasons = detector.check_liveness()
                
                if confidence < 85:
                    await websocket.send_text(f"FAILURE:Liveness check failed ({confidence}%). Reasons: {reasons}")
                    break

                # --- Liveness check passed, now proceed based on the task ---
                if task == "register":
                    await websocket.send_text("SUCCESS:Liveness confirmed")
                    break
                
                elif task == "verify":
                    # Convert the live frame to bytes for embedding
                    _, img_encoded = cv2.imencode('.jpg', liveness_results['best_frame'])
                    image_bytes = img_encoded.tobytes()

                    embedding = face_service.generate_embedding(image_bytes)
                    if embedding is None:
                        await websocket.send_text("FAILURE:Face could not be processed clearly.")
                        break

                    matching_user = face_service.find_matching_user(db, target_embedding=embedding)
                    if matching_user:
                        sms_service.send_otp(matching_user.phone_number)
                        await websocket.send_text("SUCCESS:Verification successful. OTP has been sent to your mobile.")
                    else:
                        await websocket.send_text("FAILURE:User not recognized.")
                    break
                
                else:
                    await websocket.send_text("FAILURE:Invalid task specified.")
                    break
    
    except WebSocketDisconnect:
        print("Client disconnected from vision websocket.")
    except Exception as e:
        print(f"An error occurred in the vision websocket: {e}")
        try:
            # Attempt to send a generic failure message before closing
            await websocket.send_text("FAILURE:An unexpected error occurred.")
        except:
            pass # Ignore if sending fails because the socket is already closed
    finally:
        await websocket.close()
        next(db_generator, None) # Properly close the database session generator