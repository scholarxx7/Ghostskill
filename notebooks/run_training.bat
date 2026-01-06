@echo off
REM GhostSkill Training Notebook - Quick Start Script
REM This script sets up the environment and launches the Jupyter notebook

echo ╔══════════════════════════════════════════════════════════════╗
echo ║   🧠 GhostSkill Wisdom Training - Quick Start               ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

echo ✅ Python detected
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo 📦 Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ❌ Failed to create virtual environment
        pause
        exit /b 1
    )
    echo ✅ Virtual environment created
) else (
    echo ✅ Virtual environment already exists
)

echo.
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo 📥 Installing dependencies...
pip install -q --upgrade pip
pip install -q -r requirements.txt

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Create models directory if it doesn't exist
if not exist "..\models\" (
    mkdir "..\models"
    echo ✅ Created models directory
)

echo.
echo 🚀 Launching Jupyter Notebook...
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║   The notebook will open in your browser                    ║
echo ║   Press Ctrl+C in this window to stop the server           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

jupyter notebook wisdom_training.ipynb

REM Deactivate virtual environment when done
call venv\Scripts\deactivate.bat
