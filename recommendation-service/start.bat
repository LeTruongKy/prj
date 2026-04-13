@echo off
REM Startup script for CTU Activity Recommendation Service (Windows)

echo Starting CTU Activity Recommendation Service...
echo.

REM Check if virtual environment exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if dependencies are installed
echo Installing dependencies...
pip install -q -r requirements.txt

REM Run the service
echo.
echo ========================================
echo Starting service on http://localhost:8001
echo API Docs: http://localhost:8001/docs
echo ========================================
echo.

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

pause
