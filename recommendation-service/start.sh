#!/bin/bash

# Startup script for CTU Activity Recommendation Service (Unix/Linux/macOS)

echo "Starting CTU Activity Recommendation Service..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
echo "Installing dependencies..."
pip install -q -r requirements.txt

# Run the service
echo ""
echo "========================================"
echo "Starting service on http://localhost:8001"
echo "API Docs: http://localhost:8001/docs"
echo "========================================"
echo ""

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
