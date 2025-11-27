import cv2
import pytesseract
import platform

if platform.system() == "Windows":
    # Adjust this path if your Tesseract is installed elsewhere
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def preprocess_for_ocr(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    return cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C,
        cv2.THRESH_BINARY, 31, 10
    )


def run_ocr(img_bgr) -> str:
    processed = preprocess_for_ocr(img_bgr)
    text = pytesseract.image_to_string(processed, config="--oem 3 --psm 6")
    return text
