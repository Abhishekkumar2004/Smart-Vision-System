import os
import cv2

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

# Compatible import for all FER versions
try:
    from fer import FER
except ImportError:
    from fer.fer import FER

_emotion_detector = None


def get_emotion_detector():
    """
    Lazy-load FER model so it loads only once.
    """
    global _emotion_detector
    if _emotion_detector is None:
        try:
            _emotion_detector = FER(mtcnn=False)
        except:
            # fallback if mtcnn argument fails in older versions
            _emotion_detector = FER()
    return _emotion_detector


def detect_emotion(img_bgr):
    """
    Detect dominant emotion from a BGR image (OpenCV frame).
    Returns:
        { "emotion": str or None, "scores": dict }
    """
    detector = get_emotion_detector()
    result = detector.detect_emotions(img_bgr)

    if not result:
        return {"emotion": None, "scores": {}}

    emotions = result[0]["emotions"]
    emotion = max(emotions, key=emotions.get)
    return {"emotion": emotion, "scores": emotions}
