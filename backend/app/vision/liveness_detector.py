import cv2
import mediapipe as mp
import numpy as np

# --- CONFIGURATION CONSTANTS (from your original script) ---
EAR_BLINK_THRESH = 0.22
BLINK_CONSEC_FRAMES = 2
IRIS_MOVE_THRESH = 0.012
HEAD_MOVE_THRESH = 0.015
SKIN_PCT_MIN = 0.08
LAPLACIAN_MIN = 25.0
MIN_VALID_FRAMES = 8

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]
LEFT_IRIS = [468, 469, 470, 471, 472]
RIGHT_IRIS = [473, 474, 475, 476, 477]

# --- UTILITY FUNCTIONS (from your original script) ---
def euclid(a, b):
    return float(np.linalg.norm(np.array(a) - np.array(b)))

def laplacian_var_gray(img_gray):
    return cv2.Laplacian(img_gray, cv2.CV_64F).var()

def compute_ear(lm, w, h, indices):
    try:
        pts = np.array([[lm[i].x * w, lm[i].y * h] for i in indices])
        A = euclid(pts[1], pts[5])
        B = euclid(pts[2], pts[4])
        C = euclid(pts[0], pts[3]) + 1e-9
        return (A + B) / (2.0 * C)
    except:
        return None

class LivenessDetector:
    """
    A class to detect liveness from a stream of video frames.
    It encapsulates the state and logic for a single liveness check session.
    """
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            refine_landmarks=True, max_num_faces=1,
            min_detection_confidence=0.5, min_tracking_confidence=0.5
        )
        self.prev = {}  # State dictionary for tracking changes between frames
        self.frames_history = []
        self.best_frame_laplacian = 0.0

    def analyze_frame(self, frame):
        """
        Processes a single frame to extract liveness metrics.
        """
        h, w = frame.shape[:2]
        out = {
            "face": False, "ear": None, "blink": False, "iris_shift": 0.0,
            "head_delta": 0.0, "skin_pct": 0.0, "lap_var": 0.0, "best_frame": frame
        }

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        res = self.face_mesh.process(rgb)
        if not res.multi_face_landmarks:
            self.frames_history.append(out)
            return out

        lm = res.multi_face_landmarks[0].landmark
        out["face"] = True

        pts = np.array([[p.x * w, p.y * h] for p in lm])
        x_min, y_min = int(pts[:, 0].min()), int(pts[:, 1].min())
        x_max, y_max = int(pts[:, 0].max()), int(pts[:, 1].max())
        face_roi = frame[y_min:y_max, x_min:x_max]

        if face_roi.size > 0:
            gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
            out["lap_var"] = laplacian_var_gray(gray)
            if out["lap_var"] > self.best_frame_laplacian:
                self.best_frame_laplacian = out["lap_var"]
                out["best_frame"] = frame # Store the sharpest frame

            ycrcb = cv2.cvtColor(face_roi, cv2.COLOR_BGR2YCrCb)
            skin_mask = cv2.inRange(ycrcb, (0, 133, 77), (255, 173, 127))
            out["skin_pct"] = float((skin_mask > 0).sum()) / (skin_mask.size + 1e-9)

        earL = compute_ear(lm, w, h, LEFT_EYE)
        earR = compute_ear(lm, w, h, RIGHT_EYE)
        if earL and earR:
            ear = (earL + earR) / 2.0
            out["ear"] = ear
            if ear < EAR_BLINK_THRESH:
                self.prev.setdefault("closed_frames", 0)
                self.prev["closed_frames"] += 1
            else:
                if self.prev.get("closed_frames", 0) >= BLINK_CONSEC_FRAMES:
                    out["blink"] = True
                self.prev["closed_frames"] = 0

        if max(LEFT_IRIS + RIGHT_IRIS) < len(lm):
            iris_center = np.mean([[lm[i].x * w, lm[i].y * h] for i in LEFT_IRIS + RIGHT_IRIS], axis=0)
            self.prev.setdefault("iris_prev", iris_center)
            out["iris_shift"] = euclid(iris_center, self.prev["iris_prev"]) / max(1, (x_max - x_min))
            self.prev["iris_prev"] = iris_center

        nose = np.array([lm[1].x * w, lm[1].y * h])
        self.prev.setdefault("nose_prev", nose)
        out["head_delta"] = euclid(nose, self.prev["nose_prev"]) / max(1, (x_max - x_min))
        self.prev["nose_prev"] = nose

        self.frames_history.append(out)
        return out

    def check_liveness(self):
        """
        Analyzes the accumulated frame history to make a final liveness decision.
        """
        valid = [f for f in self.frames_history if f["face"]]
        if len(valid) < MIN_VALID_FRAMES:
            return 0, "Too few valid frames"

        blink_count = sum(1 for f in valid if f["blink"])
        iris_moves = sum(1 for f in valid if f["iris_shift"] > IRIS_MOVE_THRESH)
        head_moves = sum(1 for f in valid if f["head_delta"] > HEAD_MOVE_THRESH)
        skin_med = np.median([f["skin_pct"] for f in valid])
        lap_med = np.median([f["lap_var"] for f in valid])

        score = 0
        score += 0.40 * (blink_count > 0 or iris_moves > 0)
        score += 0.25 * (skin_med >= SKIN_PCT_MIN and lap_med >= LAPLACIAN_MIN)
        score += 0.20 * (head_moves > 0)
        score += 0.15 * (blink_count > 0)

        confidence = int(score * 100)
        
        reasons = []
        if blink_count > 0: reasons.append("Blink detected")
        if iris_moves > 0: reasons.append("Iris movement OK")
        if head_moves > 0: reasons.append("Head motion OK")
        if skin_med >= SKIN_PCT_MIN and lap_med >= LAPLACIAN_MIN: reasons.append("Skin/Texture OK")
        
        return confidence, ", ".join(reasons) if reasons else "No liveness indicators found"