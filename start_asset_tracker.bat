@echo off
echo Starting Asset Tracker...

echo Starting Backend...
start cmd /k "cd backend && npm start"

echo Starting Frontend...
start cmd /k "cd frontend && npm start"

echo Asset Tracker started successfully!
echo You can now access the application in your web browser.
pause