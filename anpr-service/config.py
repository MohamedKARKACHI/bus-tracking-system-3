"""
ANPR Service Configuration
"""
import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).parent
MODEL_DIR = BASE_DIR / "models"
UPLOADS_DIR = BASE_DIR / "uploads"

# Create directories if they don't exist
MODEL_DIR.mkdir(exist_ok=True)
UPLOADS_DIR.mkdir(exist_ok=True)

# Model configuration
MODEL_PATH = os.getenv("ANPR_MODEL_PATH", str(MODEL_DIR / "best.pt"))
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.5"))

# Moroccan plate configuration
VALID_ARABIC_CHARS = 'أبجدهوزحطيكلمنصعفسقرشت'
OCR_ALLOWLIST = VALID_ARABIC_CHARS + '0123456789|[]{}()<>'

# Arabic letter mapping for OCR corrections
ARABIC_CHAR_MAPPING = {
    '1': 'أ', '7': 'أ', '|': 'أ', 'I': 'أ', 'l': 'أ', '!': 'أ', '.': 'أ', ']': 'أ', '[': 'أ', 'f': 'أ',
    '_': 'ب', '-': 'ب',
    'c': 'د', 'C': 'د', '<': 'د', '(': 'د',
    'o': 'ه', 'O': 'ه', '0': 'ه', '5': 'ه',
    '9': 'و', 'g': 'و',
    'p': 'م', 'P': 'م',
}

# Server configuration
HOST = os.getenv("ANPR_HOST", "0.0.0.0")
PORT = int(os.getenv("ANPR_PORT", "8001"))
DEBUG = os.getenv("ANPR_DEBUG", "true").lower() == "true"

# CORS origins
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4000",
    "http://127.0.0.1:4000",
]
