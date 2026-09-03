@echo off
echo ====================================================
echo    STARTING AURA APEX BANKING MANAGEMENT SYSTEM
echo ====================================================
echo Starting Backend API Server (Port 5000)...
start "Aura Backend" cmd /k "cd backend && node server.js"
timeout /t 3 /nobreak >nul
echo Starting Frontend Web Portal (Port 5173)...
start "Aura Frontend" cmd /k "cd frontend && npm run dev"
echo System operational at http://localhost:5173