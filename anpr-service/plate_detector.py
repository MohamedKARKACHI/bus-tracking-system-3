"""
Moroccan License Plate Detector using YOLOv8 + EasyOCR
Optimized for Moroccan plate format: SERIAL | LETTER | REGION (e.g., 13456 | ب | 27)
"""
import cv2
import numpy as np
from typing import Optional, Tuple, List, Dict
from dataclasses import dataclass
from pathlib import Path
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class PlateDetection:
    """Represents a detected license plate"""
    plate_text: str
    serial_number: str
    arabic_letter: str
    region_code: str
    confidence: float
    bbox: Tuple[int, int, int, int]  # x1, y1, x2, y2
    plate_image: Optional[np.ndarray] = None
    
    def to_dict(self) -> Dict:
        return {
            "plate_text": self.plate_text,
            "serial_number": self.serial_number,
            "arabic_letter": self.arabic_letter,
            "region_code": self.region_code,
            "serial": self.serial_number,
            "letter": self.arabic_letter,
            "region": self.region_code,
            "confidence": round(self.confidence, 2),
            "bbox": list(self.bbox),
            "formatted": f"{self.serial_number} | {self.arabic_letter} | {self.region_code}",
            "fullResult": f"{self.serial_number} | {self.arabic_letter} | {self.region_code}",
            "timestamp": os.path.getmtime(self.model_path) if hasattr(self, 'model_path') else 0 # Dummy for now, main takes care of real time
        }


class MoroccanPlateDetector:
    """
    YOLOv8-based Moroccan License Plate Detector with EasyOCR
    """
    
    VALID_ARABIC_CHARS = 'أبجدهوزحطيكلمنصعفسقرشت'
    
    def __init__(self, model_path: str, use_gpu: bool = True):
        """
        Initialize the detector with YOLO model and EasyOCR readers
        
        Args:
            model_path: Path to the YOLOv8 .pt model file
            use_gpu: Whether to use GPU acceleration
        """
        self.model_path = model_path
        self.use_gpu = use_gpu
        self.model = None
        self.reader_numbers = None
        self.reader_arabic = None
        self._initialized = False
        
    def initialize(self):
        """Load models (called lazily on first detection)"""
        if self._initialized:
            return
            
        logger.info("Initializing ANPR models...")
        
        try:
            from ultralytics import YOLO
            import easyocr
            import torch
            
            # Load YOLO model
            if not Path(self.model_path).exists():
                raise FileNotFoundError(f"Model not found at {self.model_path}")
            
            self.model = YOLO(self.model_path)
            # Select best available device (prefer Apple MPS, then CUDA, else CPU)
            device = 'cpu'
            if hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
                device = 'mps'
            elif torch.cuda.is_available():
                device = 'cuda'
            try:
                # ultralytics model has .to() support
                self.model.to(device)
                logger.info(f"YOLO model moved to device: {device}")
            except Exception as _:
                logger.info("YOLO device placement not applied; using default")
            logger.info(f"YOLO model loaded from {self.model_path}")
            
            # Load EasyOCR readers
            # EasyOCR GPU uses CUDA only; disable GPU on non-CUDA platforms (e.g., macOS MPS)
            use_easyocr_gpu = torch.cuda.is_available() and self.use_gpu
            self.reader_numbers = easyocr.Reader(['en'], gpu=use_easyocr_gpu)
            self.reader_arabic = easyocr.Reader(['ar', 'en'], gpu=use_easyocr_gpu)
            logger.info("EasyOCR readers initialized")
            
            self._initialized = True
            logger.info("ANPR models ready!")
            
        except Exception as e:
            logger.error(f"Failed to initialize models: {e}")
            raise
    
    def _map_to_arabic_char(self, text: str) -> str:
        """Map OCR output to valid Arabic character"""
        text = text.strip()
        if not text:
            return "?"
        
        char = text[0]
        
        # Mapping rules for common OCR misreads in Moroccan plates
        mappings = {
            '1': 'أ', '7': 'أ', '|': 'أ', 'I': 'أ', 'l': 'أ', '!': 'أ', 
            '.': 'أ', ']': 'أ', '[': 'أ', 'f': 'أ', 'i': 'أ',
            '_': 'ب', '-': 'ب', '—': 'ب',
            'c': 'د', 'C': 'د', '<': 'د', '(': 'د', 'd': 'د', 'D': 'د',
            'o': 'ه', 'O': 'ه', '5': 'ه', '0': 'ه',
            '9': 'و', 'g': 'و', '6': 'و',
            'p': 'م', 'P': 'م', 'm': 'م', 'M': 'م',
            's': 'س', 'S': 'س',
            'v': '٧', 'V': '٧',
        }
        
        if char in mappings:
            return mappings[char]
        if char in self.VALID_ARABIC_CHARS:
            return char
        return 'أ'  # Default fallback
    
    def _preprocess_plate(self, plate_img: np.ndarray) -> np.ndarray:
        """
        Balanced Preprocessing: Prioritizes character connectivity.
        Avoids shattering digits into pieces.
        """
        h, w = plate_img.shape[:2]
        # Upscale slightly less to prevent blurring/distortion
        plate_img = cv2.resize(plate_img, (w * 2, h * 2), interpolation=cv2.INTER_CUBIC)
        
        # 1. Grayscale
        gray = cv2.cvtColor(plate_img, cv2.COLOR_BGR2GRAY)
        
        # 2. Strong contrast enhancement
        clahe = cv2.createCLAHE(clipLimit=5.0, tileGridSize=(8, 8))
        gray = clahe.apply(gray)
        
        # 3. Median blur to remove noise with less artifacting than Bilateral
        gray = cv2.medianBlur(gray, 3)
        
        # 4. Adaptive Threshold with large block size to keep characters 'thick'
        binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                      cv2.THRESH_BINARY, 15, 3)
        
        return binary
    
    def _split_plate_zones(self, plate_img: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Split Moroccan plate into 3 zones with safer boundaries
        """
        h, w = plate_img.shape
        
        # Serial number zone (left side): 0% to 46%
        img_serial = plate_img[:, 0:int(w * 0.46)]
        
        # Arabic letter zone (center): 53% to 68%
        # Narrowed slightly to avoid vertical bars
        img_letter_col = plate_img[:, int(w * 0.53):int(w * 0.68)]
        h_col, w_col = img_letter_col.shape
        # Vertical crop to focus on the character
        img_letter = img_letter_col[int(h_col * 0.1):int(h_col * 0.9), :]
        
        # Region code zone (right side): 75% to 100%
        img_region = plate_img[:, int(w * 0.75):w]
        
        return img_serial, img_letter, img_region
    
    def _enhance_arabic_letter(self, img_letter: np.ndarray) -> np.ndarray:
        """Enhance the Arabic letter zone for better OCR"""
        # Add border padding
        img_letter = cv2.copyMakeBorder(
            img_letter, 30, 30, 30, 30, 
            cv2.BORDER_CONSTANT, value=255
        )
        
        # Erode to make characters thicker
        kernel = np.ones((3, 3), np.uint8)
        img_letter = cv2.erode(img_letter, kernel, iterations=1)
        
        return img_letter
    
    def detect_only_boxes(self, image: np.ndarray, confidence_threshold: float = 0.5) -> List[Tuple[int, int, int, int]]:
        """
        Fast detection of plate bounding boxes only (no OCR)
        """
        self.initialize()
        results = self.model(image, verbose=False)
        boxes = []
        for result in results:
            for box in result.boxes:
                conf = float(box.conf[0])
                if conf >= confidence_threshold:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    boxes.append((x1, y1, x2, y2))
        return boxes

    def _read_text_ensemble(self, reader, image: np.ndarray, allowlist: str = None, is_numeric: bool = False) -> str:
        """
        Run OCR at 2 scales and pick the most complete result.
        'Balanced Mode' for connectivity and speed.
        """
        if image.size == 0:
            return "?"
            
        scales = [1.0, 1.8]
        results = []
        
        for s in scales:
            if s == 1.0:
                img_scaled = image
            else:
                h, w = image.shape[:2]
                img_scaled = cv2.resize(image, (int(w * s), int(h * s)), interpolation=cv2.INTER_CUBIC)
            
            res = reader.readtext(img_scaled, allowlist=allowlist, mag_ratio=2)
            if res:
                results.append(res[0][1].strip())
        
        if not results:
            return "?"
            
        if is_numeric:
            # For serial/region, prioritize the LONGEST string to avoid fragmentation like '16'
            results.sort(key=len, reverse=True)
            return results[0]
        else:
            # For letters, use consistency (most frequent)
            from collections import Counter
            counts = Counter(results)
            return counts.most_common(1)[0][0]

    def detect_only_boxes(self, image: np.ndarray, confidence_threshold: float = 0.5) -> List[Tuple[int, int, int, int]]:
        """
        Fast detection of plate bounding boxes only (no OCR)
        """
        self.initialize()
        results = self.model(image, verbose=False)
        boxes = []
        for result in results:
            for box in result.boxes:
                conf = float(box.conf[0])
                if conf >= confidence_threshold:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    boxes.append((x1, y1, x2, y2))
        return boxes

    def detect_from_image(self, image: np.ndarray, confidence_threshold: float = 0.5) -> List[PlateDetection]:
        """
        Detect license plates with Deep Scan accuracy (Padding + Ensemble OCR).
        """
        self.initialize()
        detections = []
        h_img, w_img = image.shape[:2]
        
        # Run YOLO detection
        results = self.model(image, verbose=False)
        
        for result in results:
            for box in result.boxes:
                conf = float(box.conf[0])
                if conf < confidence_threshold:
                    continue
                
                # 1. Get bbox with 12% padding for 'Deep Scan'
                x1_raw, y1_raw, x2_raw, y2_raw = map(int, box.xyxy[0])
                bw = x2_raw - x1_raw
                bh = y2_raw - y1_raw
                padding_w = int(bw * 0.12)
                padding_h = int(bh * 0.12)
                
                x1 = max(0, x1_raw - padding_w)
                y1 = max(0, y1_raw - padding_h)
                x2 = min(w_img, x2_raw + padding_w)
                y2 = min(h_img, y2_raw + padding_h)
                
                # Extract plate region
                plate_color = image[y1:y2, x1:x2]
                if plate_color.size == 0:
                    continue
                
                # 2. Deep Preprocess
                clean_plate = self._preprocess_plate(plate_color)
                zone_serial, zone_letter, zone_region = self._split_plate_zones(clean_plate)
                zone_letter_enhanced = self._enhance_arabic_letter(zone_letter)
                
                # 3. Ensemble OCR for all zones (Prioritize length for numbers)
                serial_number = self._read_text_ensemble(self.reader_numbers, zone_serial, '0123456789', is_numeric=True)
                
                ocr_allowlist = self.VALID_ARABIC_CHARS + '0123456789|[]{}()<>'
                raw_letter = self._read_text_ensemble(self.reader_arabic, zone_letter_enhanced, ocr_allowlist, is_numeric=False)
                arabic_letter = self._map_to_arabic_char(raw_letter)
                
                region_code = self._read_text_ensemble(self.reader_numbers, zone_region, '0123456789', is_numeric=True)
                
                # 4. Whole-Plate Fallback if needed
                if serial_number == "?" or region_code == "?" or arabic_letter == "?":
                    logger.info("Zone OCR incomplete. Running whole-plate ensemble fallback...")
                    res_full = self.reader_numbers.readtext(clean_plate, allowlist='0123456789', mag_ratio=2)
                    nums = [r[1] for r in res_full if len(r[1]) >= 1]
                    
                    if len(nums) >= 2:
                        nums.sort(key=len, reverse=True)
                        if serial_number == "?": serial_number = nums[0]
                        if region_code == "?" and len(nums) > 1: region_code = nums[1]
                
                # Create formatted plate text
                plate_text = f"{serial_number}-{arabic_letter}-{region_code}"
                
                detection = PlateDetection(
                    plate_text=plate_text,
                    serial_number=serial_number,
                    arabic_letter=arabic_letter,
                    region_code=region_code,
                    confidence=conf,
                    bbox=(x1, y1, x2, y2),
                    plate_image=plate_color
                )
                
                detections.append(detection)
                logger.info(f"Deep Scan Result: {serial_number} | {arabic_letter} | {region_code}")
        
        return detections
    
    def detect_from_file(self, image_path: str, confidence_threshold: float = 0.5) -> List[PlateDetection]:
        """Detect plates from an image file"""
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not read image: {image_path}")
        return self.detect_from_image(image, confidence_threshold)
    
    def detect_from_base64(self, base64_str: str, confidence_threshold: float = 0.5) -> List[PlateDetection]:
        """Detect plates from a base64-encoded image"""
        import base64
        
        # Remove data URL prefix if present
        if ',' in base64_str:
            base64_str = base64_str.split(',')[1]
        
        # Decode base64
        img_data = base64.b64decode(base64_str)
        nparr = np.frombuffer(img_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise ValueError("Could not decode base64 image")
        
        return self.detect_from_image(image, confidence_threshold)


# Singleton instance
_detector_instance: Optional[MoroccanPlateDetector] = None

def get_detector(model_path: str = None) -> MoroccanPlateDetector:
    """Get or create the singleton detector instance"""
    global _detector_instance
    
    if _detector_instance is None:
        from config import MODEL_PATH
        path = model_path or MODEL_PATH
        _detector_instance = MoroccanPlateDetector(path)
    
    return _detector_instance
