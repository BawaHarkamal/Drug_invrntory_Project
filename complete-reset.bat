@echo off
echo =============================================
echo    DRUG INVENTORY SYSTEM COMPLETE RESET
echo =============================================
echo.

echo Step 1: Stopping all Node.js processes...
taskkill /f /im node.exe > nul 2>&1
echo   Done!
echo.

echo Step 2: Cleaning temporary files...
if exist "client\node_modules\.cache" (
  rd /s /q "client\node_modules\.cache"
  echo   Cleaned React cache
)
echo.

echo Step 3: Resetting database...
call npm run setup-db
echo.

echo Step 4: Seeding medicines...
call npm run seed-medicines
echo.

echo Step 5: Copying images...
call node copy-images.js
echo.

echo Step 6: Starting server...
start cmd /k "npm run server"
echo   Server starting in a new window...
timeout /t 10 /nobreak > nul
echo.

echo Step 7: Starting client application...
start cmd /k "cd client && npm start"
echo   Client starting in a new window...
echo.

echo =============================================
echo    RESET COMPLETED SUCCESSFULLY!
echo =============================================
echo.
echo The application should now be running at:
echo   Server: http://localhost:5001
echo   Client: http://localhost:3001
echo.
echo If you still experience issues, check your browser console for errors.
echo.
echo Press any key to exit this window...
pause > nul 