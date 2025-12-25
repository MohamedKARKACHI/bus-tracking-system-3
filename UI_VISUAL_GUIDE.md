# 📱 Check-in/Out Page - Visual Guide & Screenshots

## Page Layout Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          HEADER SECTION                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🔍 Automated Check-in/Out point          ⚡ Start Service  🟢 AI Online  │
│  AI-powered license plate recognition     │  (green button)    │        │
│                                            └─────────────────┘ │        │
│                    Statistics Box:                              │        │
│                  📊 In: 5  📊 Out: 3                            │        │
│                                                                 │        │
├─────────────────────────────────────────────────────────────────────────┤
│                      CAMERA SECTION (2/3)  │  ACTIVITY LOG (1/3)        │
│                                            │                             │
│    ┌─────────────────────────────────┐   │  Recent Activity             │
│    │                                 │   │  ┌─────────────────────────┐ │
│    │      LIVE CAMERA FEED          │   │  │ 13456 | أ | 27          │ │
│    │                                 │   │  │ Ahmed Hassan    98%     │ │
│    │     ┌─────────────────────┐    │   │  │ ✅ CHECK IN  2:30 PM    │ │
│    │     │                     │    │   │  └─────────────────────────┘ │
│    │     │   [Camera Preview]  │    │   │  ┌─────────────────────────┐ │
│    │     │                     │    │   │  │ 55222 | ب | 45          │ │
│    │     │  🟢 LIVE FEED       │    │   │  │ Hassan Youssef  95%     │ │
│    │     │  ⚡ AI Powered      │    │   │  │ 🔵 CHECK OUT  1:15 PM   │ │
│    │     │                     │    │   │  └─────────────────────────┘ │
│    │     └─────────────────────┘    │   │  No recent activity...       │
│    │                                 │   │                             │
│    │    ○ Compiling / ...            │   │                             │
│    │    Scanning animation...        │   │                             │
│    └─────────────────────────────────┘   │                             │
│                                            │                             │
├─────────────────────────────────────────────────────────────────────────┤
│  CONTROL BUTTONS                                                        │
│                                                                          │
│  [📸 Capture Entry]  [📸 Capture Exit]  [Upload Image]  [⬛ Stop]       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Start Service Button States

### 🟢 Inactive (Default)
```
┌──────────────────────────┐
│ ⚡ Start Service          │
└──────────────────────────┘
- Green gradient background
- Ready to click
- Shows lightning bolt icon
```

### 🔴 Active
```
┌──────────────────────────┐
│ ⬛ Stop Service           │
└──────────────────────────┘
- Red background
- Shows stop square icon
- Click to end session
```

### ⚫ Disabled
```
┌──────────────────────────┐
│ ⚡ Start Service (greyed) │
└──────────────────────────┘
- Faded out
- Can't click (greyed)
- Reason: AI Service offline
```

---

## AI Status Badge

```
🟢 AI Online              🟡 AI Offline
┌─────────────────┐       ┌─────────────────┐
│ ⚡ AI Online    │       │ ❌ AI Offline   │
└─────────────────┘       └─────────────────┘
Green background          Yellow/Amber bg
Service responsive        Service not responding
```

---

## Camera Feed States

### 📹 Camera Offline
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│            [📹]                 │
│         Camera is Offline       │
│                                 │
│    [Enable Feed Button] 💙      │
│                                 │
└─────────────────────────────────┘
- Black background
- Camera icon
- "Enable Feed" button
- Click to request permission
```

### 📹 Camera Active (Live Feed)
```
┌─────────────────────────────────┐
│ 🟢 LIVE FEED    ⚡ AI Powered  │
│ (top-left)      (top-right)     │
│  ╔═════════════════════════════╗ │
│  ║                             ║ │
│  ║   [REAL VIDEO FEED]         ║ │ ← Scanner frame
│  ║   Scanning: License plate   ║ │   (moves constantly)
│  ║                             ║ │
│  ║   [Detection Box if found]  ║ │
│  ║   13456 | أ | 27            ║ │
│  ║   Confidence: 98%           ║ │
│  ║                             ║ │
│  ╚═════════════════════════════╝ │
│                                 │
└─────────────────────────────────┘
- Live video from camera
- Scanner animation (blue lines)
- Shows detected plate when found
- Green border around detection
```

### ⏳ Processing State
```
┌─────────────────────────────────┐
│ ⚙️ PROCESSING...                │
│                                 │
│  ╔═════════════════════════════╗ │
│  ║                             ║ │
│  ║   [PROCESSING...]          ║ │
│  ║   ░░░░░░░░░░░░░░░░░░░░░░░░ ║ │ ← Loading bar
│  ║   Analyzing image...        ║ │
│  ║                             ║ │
│  ╚═════════════════════════════╝ │
│                                 │
└─────────────────────────────────┘
- Scanning animation active
- Status shows "PROCESSING..."
- Cannot capture another frame
```

---

## Statistics Display

```
NORMAL MODE                    ACTIVE MODE
┌──────────────────────┐      ┌──────────────────────┐
│ 🟢 In Today: 5       │      │ 🟢 In Today: 12      │
│ 🔵 Out Today: 3      │      │ 🔵 Out Today: 8      │
└──────────────────────┘      └──────────────────────┘

• Green pulsing dot = Check-ins
• Blue pulsing dot = Check-outs
• Numbers update in real-time
• Resets daily
```

---

## Activity Log Entry (Recent Activity)

```
EACH LOG ENTRY:

┌──────────────────────────────────────┐
│ 🚌 13456 | أ | 27                   │
│ Ahmed Hassan Hassan    98% ✅ CHECK IN │
│ 2:30 PM                              │
│ Time: 2025-12-18T14:30:00Z           │
└──────────────────────────────────────┘

Colors:
- 🚌 Bus icon (green for entry, blue for exit)
- Plate: White/Dark text
- Driver: Gray text
- Confidence: Muted
- Timestamp: Small, right-aligned
- Event type: Bold, colored (Green=IN, Blue=OUT)
```

---

## Moroccan License Plate Format

```
DETECTED PLATE DISPLAY:

┌─────────────────────────────────┐
│  Plate Detected                 │
│  ┌─────────────────────────────┐│
│  │  🇲🇦 MA │ 13456 | أ | 27    ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘

Format:
- MA flag (red background with green star)
- 2-letter code: "MA" (Morocco)
- Number: 13456
- Arabic letter: أ (Aleph)
- Series: 27

Display:
- White box with bold text
- Red MA flag on left
- Numbers in center
- Arab letter and series on right
```

---

## Button States & Interactions

### Capture Entry Button
```
ENABLED                    DISABLED
┌──────────────────┐       ┌──────────────────┐
│ 📸 Capture Entry │       │ 📸 Capture Entry │
└──────────────────┘       └──────────────────┘
Green background           Greyed out
Click to capture           Can't click
Success = green border     Reason: AI offline
                          or camera not ready
```

### Capture Exit Button
```
ENABLED                   DISABLED
┌──────────────────┐       ┌──────────────────┐
│ 📸 Capture Exit  │       │ 📸 Capture Exit  │
└──────────────────┘       └──────────────────┘
Blue background           Greyed out
Click to capture          Can't click
Success = blue border     Reason: AI offline
```

### Upload Image Button
```
┌──────────────────┐
│ 📤 Upload Image  │
└──────────────────┘
Purple border/background
Click to open file picker
Select any image file
System detects plates
```

---

## Complete User Interaction Flow

### 1️⃣ PAGE LOAD
```
User opens http://localhost:3000/checkin-checkout
                 ↓
Page loads with:
- Header title
- GREEN "Start Service" button
- 🟢 "AI Online" badge (if ANPR running)
- Statistics showing 0/0
- Black camera area with "Camera is Offline"
- Empty Recent Activity log
```

### 2️⃣ CLICK START SERVICE
```
User clicks green "Start Service" button
                 ↓
System checks:
  ✓ ANPR service online?
  ✓ Camera available?
                 ↓
Browser shows: "This site wants to access your camera"
User: Click "Allow"
                 ↓
System:
  ✓ Starts video stream
  ✓ Activates continuous detection (every 2 sec)
  ✓ Shows live camera feed
  ✓ Displays scanner frame overlay
  ✓ Button changes to RED "Stop Service"
```

### 3️⃣ CAPTURE ENTRY
```
User clicks 📸 "Capture Entry" button
                 ↓
System:
  1. Captures current video frame
  2. Converts to JPEG (base64)
  3. Sends to ANPR API (localhost:8001)
  4. Receives: plate_text, formatted, confidence
                 ↓
If plate found:
  ✓ Shows green detection box (3 seconds)
  ✓ Adds to Recent Activity log
  ✓ Updates "In Today" counter
  ✓ Persists to database
  ✓ Shows success animation
                 ↓
If no plate:
  ✗ Shows "No plate detected" message
  ✗ No database entry
```

### 4️⃣ VIEW RESULTS
```
Recent Activity updates:
┌─────────────────────────────────┐
│ 13456 | أ | 27                  │
│ Matched Driver: Ahmed Hassan    │
│ ✅ CHECK IN - 2:30 PM           │
│ Confidence: 98%                 │
└─────────────────────────────────┘

Statistics update:
📊 In Today: 1
📊 Out Today: 0
```

### 5️⃣ MORE CAPTURES
```
User repeats:
- Click "Capture Entry" for more entries
- Click "Capture Exit" for exits
- Each adds to log and database
- Statistics increment
- Can continue indefinitely
```

### 6️⃣ STOP SERVICE
```
User clicks RED "Stop Service" button
                 ↓
System:
  ✓ Stops video stream
  ✓ Disables detection
  ✓ Button changes back to GREEN "Start Service"
  ✓ Camera area shows "Camera is Offline"
  ✓ All detected events persist in database
```

---

## Error States & Recovery

### Error: AI Offline
```
┌──────────────────────────────────┐
│ ⚠️ AI Service Not Available       │
│                                  │
│ The ANPR service is not online.  │
│ Ensure it's running on port 8001 │
│                                  │
│ [Retry]  [Close]                 │
└──────────────────────────────────┘

Fix:
1. Open new terminal
2. cd anpr-service && ./run.sh
3. Wait for "Uvicorn running..."
4. Retry in browser
```

### Error: Camera Permission Denied
```
┌──────────────────────────────────┐
│ ❌ Camera Access Denied            │
│                                  │
│ Please allow camera access:      │
│ 1. Check browser settings        │
│ 2. Allow camera for localhost    │
│ 3. Reload page                   │
│                                  │
│ [Reload Page]                    │
└──────────────────────────────────┘

Fix:
1. Browser → Settings → Permissions
2. Allow camera for http://localhost:3000
3. Reload page
4. Try again
```

### Error: No Plate Detected
```
⚠️ Detection Info
No license plate found in image
Try:
- Move closer to plate
- Better lighting
- Clear view of plate
- Retry capture
```

---

## Mobile View (Responsive)

### Portrait Mode (Mobile Phone)
```
┌──────────────────────────┐
│ 🔍 Check-in/Out         │
│ ⚡ Start Service  🟢 AI  │
├──────────────────────────┤
│                          │
│    Camera (full width)   │
│                          │
│    📸 Capture Entry      │
│    📸 Capture Exit       │
│    📤 Upload Image       │
│                          │
│    Recent Activity       │
│    ┌──────────────────┐  │
│    │ Plate detected   │  │
│    └──────────────────┘  │
│                          │
└──────────────────────────┘
```

---

## Performance Indicators

```
✅ Quick (< 500ms)
   - Page load
   - Button click response
   - UI update on detection

⚠️ Medium (1-2s)
   - Camera activation
   - First frame capture

🔄 Variable (1-5s)
   - Plate detection (depends on AI)
   - Database persistence
   - API response
```

---

## Accessibility Features

✅ Keyboard Navigation
- Tab between buttons
- Enter/Space to click
- Escape to close modals

✅ Screen Readers
- All buttons labeled
- Images have alt text
- Status updates announced

✅ Color Contrast
- High contrast colors
- Not solely color-dependent
- Icons + text for every action

---

## Tips for Users

💡 **Best Practices**
1. Good lighting for camera
2. Clear, unobstructed plates
3. Steady camera positioning
4. One vehicle at a time
5. Allow 2-3 seconds between captures

💡 **Troubleshooting**
- Not detecting? Try closer to plate
- System slow? Restart browser/dev server
- Button grey? Check "AI Online" badge
- Camera black? Click "Enable Feed"

---

**Your Check-in/Out system is now ready to use!** 🎉
Just click "Start Service" and watch the magic happen! 🚌
