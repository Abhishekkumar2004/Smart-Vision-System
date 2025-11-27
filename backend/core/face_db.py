import os
import numpy as np
import cv2
import face_recognition as fr

from core.attendance import record_attendance
from models.db import users_db

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
FACE_IMG_DIR = os.path.join(BASE_DIR, "faces")

DB_EMB_FILE = os.path.join(MODELS_DIR, "face_embeddings.npy")
DB_LABEL_FILE = os.path.join(MODELS_DIR, "face_labels.npy")

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(FACE_IMG_DIR, exist_ok=True)


# -----------------------------------------------------
# Load & Save Face Embedding DB
# -----------------------------------------------------
def load_db():
    """Return (embeddings, labels) from disk."""
    if os.path.exists(DB_EMB_FILE) and os.path.exists(DB_LABEL_FILE):
        embs = np.load(DB_EMB_FILE)
        labels = np.load(DB_LABEL_FILE, allow_pickle=True)
        if embs.ndim == 1:
            embs = embs.reshape(1, -1)
        return embs, labels

    return np.empty((0, 128), np.float32), np.array([], dtype=object)


def save_db(embs, labels):
    np.save(DB_EMB_FILE, embs.astype(np.float32))
    np.save(DB_LABEL_FILE, labels)


# -----------------------------------------------------
# Face Encoding / Registration
# -----------------------------------------------------
def get_face_encoding(image_bgr):
    rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    enc = fr.face_encodings(rgb)
    return enc[0] if len(enc) > 0 else None


# -----------------------------------------------------
# FACE RECOGNITION
# -----------------------------------------------------
def recognize_faces(image_bgr, threshold=0.45):
    """
    Recognize all faces in a frame and call attendance logic automatically.
    """
    embs, labels = load_db()
    rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

    locations = fr.face_locations(rgb)
    encodings = fr.face_encodings(rgb, locations)

    results = []

    for enc, (top, right, bottom, left) in zip(encodings, locations):

        # No registered faces yet
        if len(embs) == 0:
            name, dist = "UNKNOWN", None
        else:
            dists = fr.face_distance(embs, enc)
            idx = np.argmin(dists)
            dist = float(dists[idx])
            name = str(labels[idx]) if dist < threshold else "UNKNOWN"

        results.append({
            "name": name,
            "distance": dist,
            "box": [int(top), int(right), int(bottom), int(left)]
        })

        # 🔥 ERP attendance (only for valid known users)
        if name != "UNKNOWN" and users_db.find_one({"id": name}):
            record_attendance(name)

    return results
