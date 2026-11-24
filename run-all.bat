@echo off
set "DOTNET_CLI_HOME=%~dp0parali-mitra\.dotnet"
set "APPDATA=%~dp0parali-mitra\.appdata"
title Parali Mitra & Response Portal Launcher
echo ==========================================================
echo    Launching Both Agricultural Portals
echo    1. Farmer Booking Portal  -^> http://localhost:5000
echo    2. Separate Response Site -^> http://localhost:5001
echo ==========================================================

start "Farmer Portal (5000)" cmd /c "cd /d %~dp0parali-mitra && run.bat"
timeout /t 3 /nobreak >nul
start "Response Portal (5001)" cmd /c "cd /d %~dp0parali-responses && run.bat"

echo Both websites launched successfully!
pause
