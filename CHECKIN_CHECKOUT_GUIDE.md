# 🚀 Bus Tracking System - Complete Setup & Usage Guide

## Overview

This guide walks you through setting up and running the **Bus Tracking System** with the AI-powered Check-in/Out page featuring:
- ✅ Real-time license plate recognition (ANPR/LPR)
- ✅ Camera-based vehicle tracking
- ✅ Automatic database persistence
- ✅ Start/Stop button for service control
- ✅ Activity logging and statistics

---

## 🎯 Quick Start (One Command)

### Option 1: Run Everything with Root Script
```bash
cd /Users/apple/Downloads/bus-tracking-system-3
./start-all.sh
```

This will:
- ✅ Kill existing dev servers
- ✅ Start ANPR Service on port 8001
- ✅ Start Frontend on port 3000
- ✅ Display service URLs and next steps

### Option 2: Manual Start (3 Separate Terminals)

**Terminal 1 - ANPR Service (AI Recognition)**
```bash
cd anpr-service
chmod +x run.sh
./run.sh
# Runs on http://localhost:8001
```

**Terminal 2 - Frontend (Web UI)**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

**Terminal 3 - Backend (Java)**
Already running in background on port 8080 (via boot devtools)

---

## 🔧 Architecture

```
Browser (Port 3000)
    ↓
Frontend Next.js App
    ↓
┌─────────────────────────────────┐
│  /api/gate-events (Persistence) │
│         ↓                        │
│  MySQL Database                 │
│  (gate_events table)            │
└─────────────────────────────────┘

      Camera Frame
         ↓
┌─────────────────────────────────┐
│  ANPR Service (Port 8001)       │
│  - YOLOv8 Plate Detection       │
│  - EasyOCR Text Recognition     │
│  - MPS/CUDA GPU Acceleration    │
└─────────────────────────────────┘
```

---

## 📱 Using the Check-in/Out Page

### Step 1: Navigate to the Page
Open your browser and go to:
```
http://localhost:3000/checkin-checkout
```

You'll see the **Automated Check-in/Out point** page with:
- Big **Start Service** button (top-right, green gradient)
- AI Status badge showing "AI Online" or "AI Offline"
- Statistics: "In Today: X" and "Out Today: Y"
- Camera feed area (initially black)
- Recent Activity log (right side)

### Step 2: Click "Start Service"
When you click the **Start Service** button:
1. ✅ Checks if ANPR service is online
2. ✅ Requests camera permissions from your browser
3. ✅ Activates live camera feed
4. ✅ Begins continuous plate detection (every 2 seconds)
5. ✅ Button changes to red "Stop Service"

### Step 3: Capture Entry/Exit
Two options:

**Option A: Real-Time Camera Capture** (Requires camera)
- Button: **📸 Capture Entry** (green) - for vehicles entering
- Button: **📸 Capture Exit** (blue) - for vehicles exiting
- **How**: Point camera at license plate → Click button → Plate is detected, extracted, and logged

**Option B: Upload Image** (For testing without camera)
- Button: **Upload Image** (purple)
- **How**: Select a photo of a license plate → App detects and logs it

### Step 4: View Results
All detections appear in **Recent Activity** (right panel):
- Plate number (formatted: `13456 | أ | 27`)
- Driver name (matched from database)
- Timestamp
- Confidence score (e.g., `98%`)
- Type: **CHECK IN** or **CHECK OUT**

Statistics at top-right update in real-time.

---

## 🔌 API Endpoints

### Check Gate Events
```bash
# List all gate events
curl http://localhost:3000/api/gate-events

# Response:
[
  {
    "id": 1,
    "plate": "13456 | أ | 27",
    "event_type": "check_in",
    "confidence": 0.98,
    "detected_at": "2025-12-18T...",
    "source": "camera",
    "bus_id": 5,
    "bus_name": "Bus #101",
    "driver_name": "Ahmed Hassan"
  }
]
```

### Create Event (Manual Test)
```bash
curl -X POST http://localhost:3000/api/gate-events \
  -H 'Content-Type: application/json' \
  -d '{
    "plate": "13456 | أ | 27",
    "event_type": "check_in",
    "confidence": 0.98,
    "source": "simulation"
  }'
```

### ANPR Health Check
```bash
curl http://localhost:8001/health
# Response: {"status": "ok"}
```

---

## 🖼️ Page Features Redesigned

### Start Service Button
**Location**: Top-right corner, next to "AI Online" badge
- **Color**: Green gradient (inactive) → Red (active)
- **Icon**: ⚡ (Start) → ⬛ (Stop)
- **Function**: One-click service activation
- **Behavior**: 
  - Disabled if AI service offline
  - Requests camera permission on click
  - Auto-enables continuous detection

### Service Status Indicators
1. **Top-Left**: Shows "LIVE FEED", "PROCESSING...", or "OFFLINE"
2. **Top-Right**: Green "AI Powered" badge when online
3. **Header**: "AI Online" / "AI Offline" with pulsing dot
4. **Statistics**: Real-time check-in/out counters

### Camera Overlay
- **Frame Guidelines**: Blue scanner frame with corner accents
- **Scan Animation**: Horizontal line scans when processing
- **Detection Box**: Green-bordered box with detected plate appears for 3 seconds
- **Moroccan Format Display**: Red MA flag + plate number

### Activity Log
- **Auto-scrolling** list of recent detections
- **Color-coded**: Emerald for check-in, blue for check-out
- **Shows**: Plate, driver, time, confidence score

---

## ⚙️ Environment Configuration

**Frontend (.env.local)**
```
NEXT_PUBLIC_ANPR_URL=http://localhost:8001
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**ANPR Service (auto-detected)**
- GPU: MPS (Apple Silicon) → CUDA (NVIDIA) → CPU
- Port: 8001
- Python: 3.11 (auto-selected)

---

## 🛠️ Troubleshooting

### ❌ "AI Offline" Error
**Cause**: ANPR service not running
**Fix**:
```bash
cd anpr-service && ./run.sh
# Check: curl http://localhost:8001/health
```

### ❌ "Camera is Offline" Message
**Cause**: No camera detected or permission denied
**Fix**:
1. Verify your device has a camera
2. Click "Enable Feed" button
3. Allow camera access in browser prompt
4. Or upload an image instead

### ❌ "Port 3000 already in use"
**Fix**:
```bash
lsof -nP -iTCP:3000  # Find process
kill -9 <PID>        # Kill it
npm run dev          # Restart
```

### ❌ "Module not found" Errors
**Fix**:
```bash
cd frontend
npm install
npm run dev
```

### ❌ "Gate Events Not Persisting"
**Cause**: Database connection issue or ANPR detection failed
**Debug**:
```bash
# Check detection
curl http://localhost:8001/health

# Check DB connection
curl http://localhost:3000/api/gate-events

# Check logs
# Browser console (F12 → Console tab)
```

---

## 📊 Database Schema

**gate_events Table** (Auto-created)
```sql
CREATE TABLE gate_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  plate VARCHAR(50),
  plate_text VARCHAR(50),
  formatted VARCHAR(50),
  confidence FLOAT,
  event_type VARCHAR(20),
  detected_at TIMESTAMP,
  source VARCHAR(20),
  bus_id INT,
  driver_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Advanced Usage

### Simulate Detections (No Camera)
Click "Capture Entry" or "Capture Exit" buttons → System:
1. Takes a frame from camera (or shows placeholder)
2. Sends to ANPR API
3. Logs result in Recent Activity
4. Persists to database

### Upload Test Image
1. Click "Upload Image" button
2. Select a photo of a license plate
3. App detects plate and logs it
4. No camera required!

### Check Event History
```bash
# SQL query in MAMP
SELECT * FROM gate_events ORDER BY detected_at DESC;
```

### API Testing
```bash
# Test persistence with curl
curl -X POST http://localhost:3000/api/gate-events \
  -H 'Content-Type: application/json' \
  -d '{
    "plate": "13456 | أ | 27",
    "event_type": "check_in",
    "confidence": 0.95,
    "source": "test"
  }'

# Verify
curl http://localhost:3000/api/gate-events | jq '.[-1]'
```

---

## 📝 Script Commands

### Root Level (package.json)
```bash
npm run dev:all      # Start frontend + backend + ANPR (all 3 at once)
npm run dev:frontend # Just frontend (port 3000)
npm run dev:backend  # Just backend
npm run dev:anpr     # Just ANPR service
```

### Frontend Level
```bash
cd frontend
npm run dev          # Start on port 3000
npm run build        # Production build
npm run lint         # Check code
```

### ANPR Level
```bash
cd anpr-service
./run.sh             # Start service (port 8001)
```

---

## 🎨 UI/UX Improvements Made

✅ **Start Service Button**: One-click activation
✅ **Better Status Indicators**: Real-time feedback
✅ **Moroccan Plate Format**: Displays `NUM | Letter | Series` properly
✅ **Modern Design**: Glass-morphism, gradients, animations
✅ **Activity Feed**: Real-time log with color coding
✅ **Statistics**: Live counters for check-in/out
✅ **Error Handling**: Clear messages and fallbacks
✅ **Responsive Layout**: Works on desktop and mobile

---

## ✅ Testing Checklist

- [ ] Run `./start-all.sh` (or start all 3 services manually)
- [ ] Navigate to `http://localhost:3000/checkin-checkout`
- [ ] Verify "AI Online" badge is green
- [ ] Click "Start Service" button
- [ ] Allow camera permissions
- [ ] See live camera feed with scanner frame
- [ ] Click "Capture Entry" with vehicle in frame
- [ ] See detection in Recent Activity
- [ ] Check statistics updated (In Today: +1)
- [ ] Click "Capture Exit"
- [ ] Verify database via `curl http://localhost:3000/api/gate-events`

---

## 🔗 Quick Links

- **Frontend**: http://localhost:3000
- **Check-in/Out**: http://localhost:3000/checkin-checkout
- **ANPR Health**: http://localhost:8001/health
- **Gate Events API**: http://localhost:3000/api/gate-events

---

## 💡 Tips

1. **Multiple Services**: The `start-all.sh` script handles cleanup and starts everything needed
2. **Single Start Button**: All setup happens when you click "Start Service"
3. **Real-Time Sync**: All events persist immediately to the database
4. **Moroccan Format**: Plates displayed in native format with flag
5. **Confidence Scores**: Shows how confident the detection was

---

**Happy tracking! 🚌 Get real plates detected now!** 
Contact support if issues persist.
