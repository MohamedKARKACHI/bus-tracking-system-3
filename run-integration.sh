#!/bin/bash

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Bus Tracking System - Integration Mode${NC}"
echo ""

# Kill any existing processes (optional, but good for clean start)
# pkill -f "spring-boot" || true
# pkill -f "next dev" || true

# 1. Start Python AI Service
echo -e "${YELLOW}▶️  Starting Python AI Service (Port 5001)...${NC}"
cd "/Users/apple/Desktop/scane plate"
if [ -f "./start_webapp.sh" ]; then
    ./start_webapp.sh &
    PID_PYTHON=$!
    echo -e "${GREEN}✅ Python Service started (PID: $PID_PYTHON)${NC}"
else
    echo -e "${RED}❌ Python script not found at /Users/apple/Desktop/scane plate/start_webapp.sh${NC}"
fi

sleep 2

# 2. Start Java Backend
echo -e "${YELLOW}▶️  Starting Java Backend (Port 8080)...${NC}"
cd "/Users/apple/Downloads/bus-tracking-system-3/backend"
# Using nohup to keep it running if shell closes, but for this demo backgrounding is fine
mvn spring-boot:run > backend.log 2>&1 &
PID_JAVA=$!
echo -e "${GREEN}✅ Java Backend started (PID: $PID_JAVA). Logs in backend/backend.log${NC}"

sleep 5

# 3. Start Frontend
echo -e "${YELLOW}▶️  Starting Frontend (Port 3000)...${NC}"
cd "/Users/apple/Downloads/bus-tracking-system-3/frontend"
npm run dev &
PID_FRONTEND=$!
echo -e "${GREEN}✅ Frontend started (PID: $PID_FRONTEND)${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 All services launch commands issued!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "   Frontend:   http://localhost:3000/checkin-checkout"
echo -e "   Backend:    http://localhost:8080"
echo -e "   AI Service: http://localhost:5001"
echo ""
echo -e "${YELLOW}Note: Backend might take a minute to fully start.${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop this script (services will keep running in background)${NC}"

wait
