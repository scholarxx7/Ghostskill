@echo off
echo ========================================
echo   🧠 GhostSkill Startup Script
echo ========================================
echo.
echo Starting GhostSkill platform with Wisdom API...
echo.

REM Check if node_modules exists in root
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
    echo.
)

REM Check if node_modules exists in backend
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
)

REM Check if Python venv exists
if not exist "python-api\venv" (
    echo 🐍 Creating Python virtual environment...
    cd python-api
    python -m venv venv
    call venv\Scripts\activate
    echo 📦 Installing Python dependencies...
    pip install -r requirements.txt
    cd ..
    echo.
)

echo ========================================
echo   🚀 Starting All Servers
echo ========================================
echo.
echo Python Wisdom API: http://localhost:8000
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C in any window to stop the servers
echo.

REM Start Python API in new terminal
start "GhostSkill Python Wisdom API" cmd /k "cd python-api && venv\Scripts\activate && python main.py"

REM Wait 4 seconds for Python API to initialize
timeout /t 4 /nobreak >nul

REM Start backend in new terminal
start "GhostSkill Backend API" cmd /k "cd backend && npm run dev"

REM Wait 4 seconds for backend to initialize
timeout /t 4 /nobreak >nul

REM Start frontend in new terminal
start "GhostSkill Frontend" cmd /k "npm run dev"

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   ✅ All three servers are starting!
echo ========================================
echo.
echo 🐍 Python Wisdom API: http://localhost:8000
echo 📡 Backend API: http://localhost:5000
echo 🏥 Health Check: http://localhost:5000/api/health
echo 🌐 Frontend: http://localhost:3000
echo.
echo Check the opened terminal windows for server logs
echo.
echo To stop servers: Close the terminal windows or press Ctrl+C
echo.
pause
