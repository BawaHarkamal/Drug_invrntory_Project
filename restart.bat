@echo off
echo Stopping any existing node processes...
taskkill /f /im node.exe

echo.
echo Cleaning temporary files...
if exist "client\node_modules\.cache" (
  rd /s /q "client\node_modules\.cache"
  echo Cleaned React cache
)

echo.
echo Waiting for processes to clean up...
timeout /t 3 /nobreak >nul

echo.
echo Checking MongoDB connection...
node server/checkdb.js

echo.
echo Starting server and client...

start cmd /k "npm run server"

echo Waiting for server to initialize...
timeout /t 8 /nobreak >nul

echo.
echo Testing API connectivity...
node check_connection.js

echo.
echo Starting client application...
start cmd /k "cd client && npm start"

echo.
echo Done! The application should now be running at:
echo Server: http://localhost:5001
echo Client: http://localhost:3001
echo.
echo Press any key to exit this window...
pause >nul 