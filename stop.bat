@echo off
echo Stopping Aura Apex Banking services...
taskkill /f /im node.exe >nul 2>&1
echo All Node services stopped.