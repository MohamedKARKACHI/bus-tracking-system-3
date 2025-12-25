#!/bin/bash
set -euo pipefail

# ANPR Service Startup Script

echo "🚗 Starting ANPR Service..."

# Select a compatible Python (prefer 3.11 to avoid wheel issues on 3.13)
choose_python() {
    for BIN in python3.11 python3.12 python3.10 python3; do
        if command -v "$BIN" >/dev/null 2>&1; then
            echo "$BIN"
            return 0
        fi
    done
    return 1
}

PY_BIN=$(choose_python || true)
if [ -z "${PY_BIN:-}" ]; then
    echo "❌ No suitable Python found (looked for python3.11/3.12/3.10/python3)."
    echo "💡 On macOS, install one with Homebrew: brew install python@3.11"
    exit 1
fi

PY_VER=$($PY_BIN -c 'import sys; print("%d.%d"%sys.version_info[:2])')
if [[ "$PY_VER" == 3.13* ]]; then
    echo "❌ Detected Python $PY_VER. Some dependencies (opencv/easyocr) lack wheels for 3.13."
    echo "💡 Please install Python 3.11: brew install python@3.11"
    exit 1
fi

echo "🧪 Using $PY_BIN (Python $PY_VER)"

# Create venv if missing
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    $PY_BIN -m venv venv
else
    # Verify venv python version matches selected interpreter
    VENV_VER=$(./venv/bin/python -c 'import sys; print(f"{sys.version_info[0]}.{sys.version_info[1]}")' 2>/dev/null || echo "unknown")
    if [ "$VENV_VER" != "$PY_VER" ]; then
        echo "♻️  Recreating venv with Python $PY_VER (was $VENV_VER) ..."
        rm -rf venv
        $PY_BIN -m venv venv
    fi
fi

# Activate virtual environment
source venv/bin/activate

# Upgrade pip/setuptools/wheel for better binary wheel support
python -m pip install --upgrade pip setuptools wheel >/dev/null

# Enable MPS fallback for PyTorch on macOS
export PYTORCH_ENABLE_MPS_FALLBACK=1

# Install dependencies
echo "📦 Installing dependencies (this can take a few minutes)..."
pip install -r requirements.txt

# Quick import check
python - <<'PY'
try:
        import cv2
        import torch
        print(f"✅ OpenCV: {cv2.__version__}, Torch: {torch.__version__}")
except Exception as e:
        import sys
        print(f"❌ Dependency import failed: {e}")
        sys.exit(1)
PY

# Check if model exists
if [ ! -f "models/best.pt" ]; then
        echo "⚠️  Model not found at models/best.pt"
        echo "   Please copy your best.pt model to: $(pwd)/models/best.pt"
        echo "   Example: cp /path/to/best.pt models/best.pt"
fi

# Start the service
echo "🚀 Starting ANPR API on http://localhost:8001"
exec python main.py
