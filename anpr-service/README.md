# ANPR Service - Moroccan License Plate Recognition

AI-powered Automatic Number Plate Recognition (ANPR) service for Moroccan vehicles, integrated with the BusTrack system.

## Features

- 🚗 YOLOv8-based license plate detection
- 🔤 EasyOCR for reading plate text (Arabic + Numbers)
- 🇲🇦 Optimized for Moroccan plate format: `SERIAL | LETTER | REGION`
- ⚡ Real-time WebSocket updates
- 📸 Support for file upload and base64 images
- 🎥 Camera feed integration

## Moroccan Plate Format

```
┌─────────────────────────────────────────┐
│ ⭐ │  13456  │  ب  │  27  │
│ MA │ Serial  │ Ar  │ Reg  │
└─────────────────────────────────────────┘
```

- **Serial Number**: 5 digits (e.g., 13456)
- **Arabic Letter**: Single Arabic character (أ, ب, ج, د, ه, و, etc.)
- **Region Code**: 1-2 digits (e.g., 27)

## Setup

### 1. Copy your trained model

```bash
mkdir -p models
cp /path/to/best.pt models/best.pt
```

### 2. Install dependencies

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Run the service

```bash
python main.py
# Or use the script:
./run.sh
```

The service will start on `http://localhost:8001`

### macOS (Apple Silicon) Acceleration

- The service auto-uses Apple Metal (MPS) for YOLO when available.
- EasyOCR uses GPU only with CUDA; on macOS it runs on CPU (expected).
- For best results on macOS, keep good lighting and hold plates steady.

### Frontend Configuration

In `frontend`, point the UI to this service:

```
export NEXT_PUBLIC_ANPR_URL=http://localhost:8001
```

Make sure the ANPR service is running before opening `/checkin-checkout`.

## API Endpoints

### Detection

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/detect/upload` | Detect from uploaded image |
| POST | `/detect/base64` | Detect from base64 image |
| GET | `/detections/history` | Get recent detections |

### Cameras

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cameras` | List all cameras |
| GET | `/cameras/{id}` | Get camera status |
| POST | `/cameras/{id}/status` | Update camera status |

### Simulation (Demo)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/simulate/entry` | Simulate vehicle entry |
| POST | `/simulate/exit` | Simulate vehicle exit |

### WebSocket

| Endpoint | Description |
|----------|-------------|
| `ws://localhost:8001/ws/detections` | Real-time detection updates |

## Example Usage

### Upload Image

```bash
curl -X POST "http://localhost:8001/detect/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@plate_image.jpg"
```

### Base64 Detection (for webcam)

```javascript
const response = await fetch('http://localhost:8001/detect/base64', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    image: 'data:image/jpeg;base64,...',
    confidence_threshold: 0.5
  })
});
```

### WebSocket Connection

```javascript
const ws = new WebSocket('ws://localhost:8001/ws/detections');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'detection') {
    console.log('Plate detected:', data.data);
  }
};

// Send camera frame
ws.send('frame:' + base64ImageData);
```

## Response Format

```json
{
  "success": true,
  "detections": [
    {
      "plate_text": "13456-ب-27",
      "serial_number": "13456",
      "arabic_letter": "ب",
      "region_code": "27",
      "confidence": 0.95,
      "bbox": [100, 200, 400, 280],
      "formatted": "13456 | ب | 27",
      "timestamp": "2025-12-18T12:00:00"
    }
  ],
  "count": 1,
  "processing_time_ms": 234.5
}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ANPR_MODEL_PATH` | `models/best.pt` | Path to YOLO model |
| `ANPR_HOST` | `0.0.0.0` | Server host |
| `ANPR_PORT` | `8001` | Server port |
| `CONFIDENCE_THRESHOLD` | `0.5` | Detection threshold |

## Integration with BusTrack

This service integrates with:
- **ANPR Cameras page** (`/cameras`) - Camera monitoring
- **Check-in/Out page** (`/checkin-checkout`) - Automated vehicle entry/exit
