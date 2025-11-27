from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
import cv2
import time

# Core modules
from core.face_db import (
    load_db,
    save_db,
    get_face_encoding,
    recognize_faces,
    FACE_IMG_DIR
)
from core.ocr import run_ocr
from core.emotion import detect_emotion

# ERP router
from core.erp import router as erp_router


app = FastAPI(title="Smart Vision Suite API")


# ------------- CORS ---------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Attach ERP routes
app.include_router(erp_router)


# Utility: read image from UploadFile
def read_image(upload: UploadFile):
    try:
        data = np.frombuffer(upload.file.read(), np.uint8)
        img = cv2.imdecode(data, cv2.IMREAD_COLOR)
        return img
    except Exception:
        return None


# -------------------------------------------------
# REGISTER FACE
# -------------------------------------------------
@app.post("/api/register_face")
async def register_face(name: str = Form(...), file: UploadFile = File(...)):
    img = read_image(file)
    if img is None:
        return JSONResponse({"success": False, "message": "Invalid image file"}, status_code=400)

    encoding = get_face_encoding(img)
    if encoding is None:
        return JSONResponse({"success": False, "message": "No face detected"}, status_code=400)

    embs, labels = load_db()

    # Prevent duplicate face
    if len(embs) > 0:
        from face_recognition import face_distance
        dists = face_distance(embs, encoding)
        idx = int(np.argmin(dists))
        if dists[idx] < 0.45:
            return {"success": False, "message": f"Face already exists ({labels[idx]})"}

    # Save face image for record
    ts = int(time.time())
    img_path = f"{FACE_IMG_DIR}/{name}_{ts}.jpg"
    cv2.imwrite(img_path, img)

    # Save embedding
    if len(embs) == 0:
        embs = np.array([encoding], dtype=np.float32)
    else:
        embs = np.vstack([embs, encoding.astype(np.float32)])
    labels = np.append(labels, name)

    save_db(embs, labels)

    return {"success": True, "message": f"Face saved for {name}"}


# -------------------------------------------------
# RECOGNIZE FACE (Attendance auto-handled inside recognize_faces)
# -------------------------------------------------
@app.post("/api/recognize")
async def recognize(file: UploadFile = File(...)):
    img = read_image(file)
    if img is None:
        return JSONResponse({"success": False, "message": "Invalid image file"}, status_code=400)

    faces = recognize_faces(img)  # auto attendance trigger inside
    return {"success": True, "faces": faces}


# -------------------------------------------------
# EMOTION API
# -------------------------------------------------
@app.post("/api/emotion")
async def emotion(file: UploadFile = File(...)):
    img = read_image(file)
    if img is None:
        return JSONResponse({"success": False, "message": "Invalid image file"}, status_code=400)

    try:
        result = detect_emotion(img)
        return {"success": True, **result}
    except Exception as e:
        print("Emotion error:", e)
        return {"success": False, "emotion": None, "scores": {}}


# -------------------------------------------------
# OCR API
# -------------------------------------------------
@app.post("/api/ocr")
async def ocr(file: UploadFile = File(...)):
    img = read_image(file)
    if img is None:
        return JSONResponse({"success": False, "message": "Invalid image file"}, status_code=400)

    try:
        text = run_ocr(img)
        return {"success": True, "text": text}
    except Exception as e:
        print("OCR error:", e)
        return {"success": False, "text": ""}


@app.get("/")
def root():
    return {"status": "backend running"}
