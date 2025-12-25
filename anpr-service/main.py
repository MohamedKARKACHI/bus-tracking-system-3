"""
ANPR Service - FastAPI Application
Moroccan License Plate Recognition API
"""
import asyncio
import base64
import cv2
import numpy as np
from datetime import datetime
from typing import List, Optional
from pathlib import Path
import sys

from fastapi import FastAPI, File, UploadFile, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

import config
from plate_detector import MoroccanPlateDetector, PlateDetection, get_detector

# ==========================================
# FastAPI Application
# ==========================================

app = FastAPI(
    title="ANPR Service - Moroccan Plate Recognition",
    description="AI-powered license plate detection for Moroccan vehicles",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# Pydantic Models
# ==========================================

class DetectionResult(BaseModel):
    plate_text: str
    serial_number: str
    arabic_letter: str
    region_code: str
    confidence: float
    bbox: List[int]
    formatted: str
    timestamp: str

class DetectionResponse(BaseModel):
    success: bool
    detections: List[DetectionResult]
    count: int
    processing_time_ms: float

class Base64ImageRequest(BaseModel):
    image: str  # Base64 encoded image
    confidence_threshold: Optional[float] = 0.5

class CameraStatusResponse(BaseModel):
    camera_id: str
    status: str
    last_detection: Optional[str]
    detection_count: int

# ==========================================
# In-Memory Storage (for demo)
# ==========================================

detection_history: List[dict] = []
camera_statuses: dict = {
    "CAM-001": {"status": "online", "location": "Main Gate Entrance", "detections": 234},
    "CAM-002": {"status": "online", "location": "Central Terminal", "detections": 189},
    "CAM-003": {"status": "offline", "location": "North Exit", "detections": 0},
    "CAM-004": {"status": "online", "location": "South Parking", "detections": 156},
    "CAM-005": {"status": "online", "location": "East Terminal", "detections": 298},
    "CAM-006": {"status": "offline", "location": "West Gate", "detections": 0},
}

# WebSocket connections for real-time updates
active_connections: List[WebSocket] = []

# ==========================================
# API Endpoints
# ==========================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "ANPR Service",
        "status": "running",
        "version": "1.0.0",
        "model_loaded": Path(config.MODEL_PATH).exists()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    model_exists = Path(config.MODEL_PATH).exists()
    return {
        "status": "healthy" if model_exists else "degraded",
        "model_path": config.MODEL_PATH,
        "model_exists": model_exists,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/detect/upload", response_model=DetectionResponse)
async def detect_from_upload(
    file: UploadFile = File(...),
    confidence_threshold: float = 0.5
):
    """
    Detect license plates from an uploaded image file
    """
    start_time = datetime.now()
    
    try:
        # Read image file
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Get detector and run detection
        detector = get_detector(config.MODEL_PATH)
        detections = detector.detect_from_image(image, confidence_threshold)
        
        # Convert to response format
        results = []
        for det in detections:
            result = DetectionResult(
                **det.to_dict(),
                timestamp=datetime.now().isoformat()
            )
            results.append(result)
            
            # Store in history
            detection_history.append({
                **det.to_dict(),
                "timestamp": datetime.now().isoformat(),
                "source": "upload"
            })
        
        # Broadcast to WebSocket clients
        await broadcast_detection(results)
        
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return DetectionResponse(
            success=True,
            detections=results,
            count=len(results),
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect/base64", response_model=DetectionResponse)
async def detect_from_base64(request: Base64ImageRequest):
    """
    Detect license plates from a base64-encoded image
    (For webcam/camera feed integration)
    """
    start_time = datetime.now()
    
    try:
        detector = get_detector(config.MODEL_PATH)
        detections = detector.detect_from_base64(
            request.image, 
            request.confidence_threshold
        )
        
        results = []
        for det in detections:
            result = DetectionResult(
                **det.to_dict(),
                timestamp=datetime.now().isoformat()
            )
            results.append(result)
            
            detection_history.append({
                **det.to_dict(),
                "timestamp": datetime.now().isoformat(),
                "source": "camera"
            })
        
        await broadcast_detection(results)
        
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return DetectionResponse(
            success=True,
            detections=results,
            count=len(results),
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/detections/history")
async def get_detection_history(limit: int = 50):
    """Get recent detection history"""
    return {
        "detections": detection_history[-limit:][::-1],
        "total": len(detection_history)
    }

@app.get("/cameras")
async def get_cameras():
    """Get all camera statuses"""
    cameras = []
    for cam_id, info in camera_statuses.items():
        cameras.append({
            "id": cam_id,
            "status": info["status"],
            "location": info["location"],
            "detections": info["detections"]
        })
    return {"cameras": cameras}

@app.get("/cameras/{camera_id}")
async def get_camera(camera_id: str):
    """Get specific camera status"""
    if camera_id not in camera_statuses:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    info = camera_statuses[camera_id]
    return {
        "id": camera_id,
        **info
    }

@app.post("/cameras/{camera_id}/status")
async def update_camera_status(camera_id: str, status: str):
    """Update camera status (online/offline)"""
    if camera_id not in camera_statuses:
        camera_statuses[camera_id] = {"status": status, "location": "Unknown", "detections": 0}
    else:
        camera_statuses[camera_id]["status"] = status
    
    return {"success": True, "camera_id": camera_id, "status": status}

# ==========================================
# WebSocket for Real-time Detection
# ==========================================

@app.websocket("/ws/detections")
async def websocket_detections(websocket: WebSocket):
    """WebSocket endpoint for real-time detection updates"""
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        while True:
            # Keep connection alive and receive any messages
            data = await websocket.receive_text()
            
            # Handle incoming camera frames
            if data.startswith("frame:"):
                base64_image = data[6:]
                try:
                    detector = get_detector(config.MODEL_PATH)
                    detections = detector.detect_from_base64(base64_image, 0.5)
                    
                    if detections:
                        results = [det.to_dict() for det in detections]
                        await websocket.send_json({
                            "type": "detection",
                            "data": results,
                            "timestamp": datetime.now().isoformat()
                        })
                except Exception as e:
                    await websocket.send_json({
                        "type": "error",
                        "message": str(e)
                    })
                    
    except WebSocketDisconnect:
        active_connections.remove(websocket)

async def broadcast_detection(detections: List[DetectionResult]):
    """Broadcast detection results to all connected WebSocket clients"""
    if not detections or not active_connections:
        return
    
    message = {
        "type": "detection",
        "data": [d.dict() for d in detections],
        "timestamp": datetime.now().isoformat()
    }
    
    for connection in active_connections:
        try:
            await connection.send_json(message)
        except:
            pass

# ==========================================
# Simulation Endpoints (for demo/testing)
# ==========================================

@app.post("/simulate/entry")
async def simulate_entry():
    """Simulate a vehicle entry detection"""
    import random
    
    # Generate random Moroccan plate
    serial = str(random.randint(10000, 99999))
    letters = ['أ', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن']
    letter = random.choice(letters)
    region = str(random.randint(1, 99))
    
    detection = {
        "plate_text": f"{serial}-{letter}-{region}",
        "serial_number": serial,
        "arabic_letter": letter,
        "region_code": region,
        "confidence": round(random.uniform(0.85, 0.99), 2),
        "bbox": [100, 200, 400, 280],
        "formatted": f"{serial} | {letter} | {region}",
        "timestamp": datetime.now().isoformat(),
        "event_type": "entry",
        "source": "simulation"
    }
    
    detection_history.append(detection)
    
    # Update camera stats
    camera_statuses["CAM-001"]["detections"] += 1
    
    # Broadcast
    for connection in active_connections:
        try:
            await connection.send_json({
                "type": "entry",
                "data": detection
            })
        except:
            pass
    
    return {"success": True, "detection": detection}

@app.post("/simulate/exit")
async def simulate_exit():
    """Simulate a vehicle exit detection"""
    import random
    
    serial = str(random.randint(10000, 99999))
    letters = ['أ', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن']
    letter = random.choice(letters)
    region = str(random.randint(1, 99))
    
    detection = {
        "plate_text": f"{serial}-{letter}-{region}",
        "serial_number": serial,
        "arabic_letter": letter,
        "region_code": region,
        "confidence": round(random.uniform(0.85, 0.99), 2),
        "bbox": [100, 200, 400, 280],
        "formatted": f"{serial} | {letter} | {region}",
        "timestamp": datetime.now().isoformat(),
        "event_type": "exit",
        "source": "simulation"
    }
    
    detection_history.append(detection)
    
    for connection in active_connections:
        try:
            await connection.send_json({
                "type": "exit",
                "data": detection
            })
        except:
            pass
    
    return {"success": True, "detection": detection}

# ==========================================
# VIDEO STREAMING - Camera Feed
# ==========================================

import threading
import time as time_module

# Global camera instance and processing state
camera_instance = None
camera_running = False
selected_camera_index = 0
camera_lock = threading.Lock()
latest_raw_frame = None  # The most recent frame from the camera
output_frame = None      # The frame with overlays for the MJPEG stream
last_detection_result = None

def probe_cameras():
    """Probe system for available cameras and return their indices"""
    available = []
    # Probe indices 0 to 5
    for i in range(5):
        try:
            cap = cv2.VideoCapture(i, cv2.CAP_AVFOUNDATION)
            if not cap.isOpened():
                cap = cv2.VideoCapture(i)
                
            if cap.isOpened():
                ret, frame = cap.read()
                if ret and frame is not None:
                    # Check if it's not just a pure black frame
                    is_black = np.mean(frame) < 2
                    available.append({
                        "index": i,
                        "status": "active" if not is_black else "black_screen",
                        "label": f"Camera {i}"
                    })
                cap.release()
        except Exception as e:
            print(f"Error probing camera {i}: {e}")
            
    return available

def init_camera(index=None):
    """Initialize camera by index or search for one"""
    global camera_instance, selected_camera_index
    
    # Use global selected index if none provided
    if index is None:
        index = selected_camera_index

    # Release any existing camera
    if camera_instance is not None:
        try:
            camera_instance.release()
        except:
            pass
        camera_instance = None
    
    indices_to_try = [index] if index is not None else [0, 1, 2]
    
    for i in indices_to_try:
        print(f"Opening camera index {i}...")
        sys.stdout.flush()
        
        cap = cv2.VideoCapture(i, cv2.CAP_AVFOUNDATION)
        if not cap.isOpened():
            cap = cv2.VideoCapture(i)
            
        if cap.isOpened():
            # Warmup
            time_module.sleep(0.5)
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            
            # Verify data
            for attempt in range(5):
                ret, frame = cap.read()
                if ret and frame is not None and np.mean(frame) > 1:
                    print(f"Camera index {i} ready.")
                    sys.stdout.flush()
                    camera_instance = cap
                    selected_camera_index = i
                    return True
                time_module.sleep(0.2)
            
            print(f"Index {i} opened but returned no valid data.")
            cap.release()
    
    # If explicit index failed, try discovery as fallback
    if index is not None:
        print("Explicit camera failed. Trying discovery...")
        return init_camera(index=None)

    return False

def camera_capture_thread():
    """High-priority thread for continuous frame capture"""
    global camera_instance, camera_running, latest_raw_frame
    
    print("Capture thread starting...")
    sys.stdout.flush()
    if not init_camera():
        print("Camera initialization failed in capture thread.")
        sys.stdout.flush()
        camera_running = False
        return

    while camera_running:
        if camera_instance is None or not camera_instance.isOpened():
            time_module.sleep(0.1)
            continue
            
        ret, frame = camera_instance.read()
        if ret and frame is not None:
            with camera_lock:
                latest_raw_frame = frame.copy()
        elif not ret:
            time_module.sleep(0.1)
        
        time_module.sleep(0.001)

def ai_processing_thread():
    """Background thread for optimized AI (YOLO tracking + stable OCR)"""
    global camera_running, latest_raw_frame, last_detection_result, output_frame, selected_camera_index
    
    print(f"AI thread starting on CAM:{selected_camera_index}...")
    sys.stdout.flush()
    detector = None
    try:
        detector = get_detector(config.MODEL_PATH)
    except Exception as e:
        print(f"AI initialization failed: {e}")
        sys.stdout.flush()
        return

    stability_counter = 0
    missing_counter = 0
    STABILITY_THRESHOLD = 8  # Balanced accuracy vs speed
    MISSING_THRESHOLD = 8
    
    current_bbox = None

    while camera_running:
        frame_to_process = None
        with camera_lock:
            if latest_raw_frame is not None:
                frame_to_process = latest_raw_frame.copy()
        
        if frame_to_process is None:
            time_module.sleep(0.05)
            continue

        try:
            # 1. Fast YOLO-only detection for tracking
            boxes = detector.detect_only_boxes(frame_to_process, 0.45)
            
            if boxes:
                current_bbox = boxes[0]
                missing_counter = 0
                stability_counter += 1
                
                # 2. Trigger heavy OCR only if the plate is stable
                if stability_counter == STABILITY_THRESHOLD:
                    print("Plate stable. Running OCR...")
                    sys.stdout.flush()
                    full_detections = detector.detect_from_image(frame_to_process, 0.45)
                    if full_detections:
                        last_detection_result = full_detections[0]
                        # Bump counter so we don't OCR every frame while it stays stable
                        stability_counter += 1 
            else:
                stability_counter = 0
                missing_counter += 1
                current_bbox = None
                
                # 3. Age out the result if the plate is gone
                if missing_counter > MISSING_THRESHOLD:
                    last_detection_result = None
                    missing_counter = 0

        except Exception as e:
            print(f"AI processing error: {e}")

        # Update the output_frame with overlays
        with camera_lock:
            if latest_raw_frame is not None:
                display_frame = latest_raw_frame.copy()
                
                # Draw high-speed tracking box (YOLO)
                if current_bbox:
                    x1, y1, x2, y2 = current_bbox
                    # Blue for tracking/stabilizing, Green for OCR complete
                    color = (0, 255, 0) if last_detection_result else (255, 165, 0)
                    cv2.rectangle(display_frame, (x1, y1), (x2, y2), color, 2)
                    
                    if not last_detection_result:
                        progress = min(100, int((stability_counter/STABILITY_THRESHOLD)*100))
                        cv2.putText(display_frame, f"STABILIZING {progress}%", (x1, y1-10), 
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)

                # Draw OCR result overlay
                if last_detection_result:
                    det = last_detection_result
                    x1, y1, x2, y2 = det.bbox
                    label = det.formatted or det.plate_text
                    cv2.putText(display_frame, label, (x1, y1-10), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                
                # Status and Debug Info
                timestamp = time_module.strftime("%H:%M:%S")
                debug_info = f"CAM:{selected_camera_index} | {timestamp}"
                cv2.putText(display_frame, debug_info, (10, 25), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                
                # Encode for stream
                success, buffer = cv2.imencode('.jpg', display_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                if success:
                    output_frame = buffer.tobytes()

        # Cooldown
        time_module.sleep(0.01)

def generate_frames():
    """Generator for MJPEG stream - optimized for immediate feedback"""
    global output_frame, camera_running, latest_raw_frame
    
    print("Stream generator starting...")
    sys.stdout.flush()
    while camera_running:
        frame_data = None
        with camera_lock:
            # Prefer the frame with AI overlays
            if output_frame is not None:
                frame_data = output_frame
            # Fallback to raw frame if AI isn't ready yet
            elif latest_raw_frame is not None:
                try:
                    success, buffer = cv2.imencode('.jpg', latest_raw_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                    if success:
                        frame_data = buffer.tobytes()
                except:
                    pass
        
        if frame_data:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_data + b'\r\n')
        else:
            # Yield a placeholder frame to indicate we are waiting
            placeholder = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(placeholder, "Connecting to camera...", (150, 240), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            _, buffer = cv2.imencode('.jpg', placeholder)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            time_module.sleep(0.5)
            continue
            
        time_module.sleep(0.03) # ~33 FPS
    print("Stream generator ending.")
    sys.stdout.flush()

@app.get("/video_feed")
def video_feed():
    """Stream video from camera with plate detection"""
    global camera_running
    print("New client connected to /video_feed")
    sys.stdout.flush()
    if not camera_running:
        return JSONResponse(content={"error": "Camera not running"}, status_code=400)
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

capture_thread_inst = None
ai_thread_inst = None

@app.get("/camera/list")
async def list_cameras():
    """List all available cameras"""
    cameras = probe_cameras()
    return {"cameras": cameras}

@app.post("/camera/start")
async def start_camera(index: Optional[int] = None):
    """Start the camera and processing threads with clean state"""
    global camera_running, capture_thread_inst, ai_thread_inst, selected_camera_index
    
    # If already running, ensure we stop first
    if camera_running:
        print("Camera already running, stopping first...")
        await stop_camera()
        
    if index is not None:
        selected_camera_index = index
        
    camera_running = True
    
    # Reset state
    global last_detection_result, latest_raw_frame, output_frame
    last_detection_result = None
    latest_raw_frame = None
    output_frame = None
    
    # 1. Capture Thread
    capture_thread_inst = threading.Thread(target=camera_capture_thread, name="CaptureThread", daemon=True)
    capture_thread_inst.start()
    
    # 2. AI Thread
    ai_thread_inst = threading.Thread(target=ai_processing_thread, name="AIThread", daemon=True)
    ai_thread_inst.start()
    
    print(f"ANPR System started on CAM:{selected_camera_index}")
    sys.stdout.flush()
    return {"status": "started", "index": selected_camera_index}

@app.post("/camera/stop")
async def stop_camera():
    """Stop all threads and release resources deterministically"""
    global camera_running, camera_instance, capture_thread_inst, ai_thread_inst
    
    if not camera_running:
        return {"status": "already_stopped"}

    print("Stopping ANPR system...")
    sys.stdout.flush()
    camera_running = False
    
    # Wait for threads to join
    if capture_thread_inst and capture_thread_inst.is_alive():
        capture_thread_inst.join(timeout=2.0)
        
    if ai_thread_inst and ai_thread_inst.is_alive():
        ai_thread_inst.join(timeout=2.0)
        
    # Final cleanup of camera instance
    if camera_instance:
        try:
            camera_instance.release()
            print("Camera hardware released.")
        except Exception as e:
            print(f"Error releasing camera: {e}")
        camera_instance = None
    
    capture_thread_inst = None
    ai_thread_inst = None
    
    print("ANPR System stopped.")
    sys.stdout.flush()
    return {"status": "stopped"}

@app.get("/camera/status")
async def camera_status():
    """Get camera status and last detection info"""
    global camera_running, last_detection_result
    
    result_dict = None
    if last_detection_result:
        result_dict = last_detection_result.to_dict()
        # Ensure timestamp is set to current unix time for frontend tracking
        result_dict["timestamp"] = time_module.time()
        
    return {
        "running": camera_running,
        "last_detection": result_dict
    }

@app.get("/camera/snapshot")
async def camera_snapshot():
    """Get current raw frame as JPEG"""
    global latest_raw_frame
    if latest_raw_frame is not None:
        success, buffer = cv2.imencode('.jpg', latest_raw_frame)
        if success:
            return StreamingResponse(iter([buffer.tobytes()]), media_type="image/jpeg")
    return {"error": "No frame available"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=config.HOST, port=config.PORT, reload=config.DEBUG)
