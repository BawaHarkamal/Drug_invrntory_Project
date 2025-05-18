@echo off
echo Starting Drug Inventory Application...

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Error: Node.js is not installed or not in your PATH
  echo Please install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

:: Run the setup script
echo Running setup script...
node setup.js

pause 