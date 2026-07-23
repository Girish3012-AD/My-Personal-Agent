@echo off
REM One-click startup for the dashboard environment
REM Update BACKEND_CMD and FRONTEND_CMD below to match your local start commands if different.

:: Backend start command (example: using uvicorn for Python)
set BACKEND_CMD=python -m uvicorn main:app --reload --port 8001

:: Frontend start command (example: Vite)
set FRONTEND_DIR=website
set FRONTEND_CMD=npm run dev --prefix "%CD%\%FRONTEND_DIR%"

:: Open separate windows for backend and frontend
start "Backend" cmd /k "%BACKEND_CMD%"
start "Frontend" cmd /k "cd %CD%\%FRONTEND_DIR% && %FRONTEND_CMD%"

:: Open the dashboard in the default browser
start "" "http://localhost:5173"
echo Launched backend (http://localhost:8001) and frontend (http://localhost:5173). Keep both windows open.
exit /b 0
