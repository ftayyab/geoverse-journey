@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install the current LTS from https://nodejs.org and rerun this file.
  pause
  exit /b 1
)
if not exist node_modules\three (
  echo Installing dependencies. This requires Internet access on the first run...
  call npm install
  if errorlevel 1 (pause & exit /b 1)
)
echo Launching GeoVerse Journey...
call npm run dev
pause
