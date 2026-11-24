@echo off
set "DOTNET_CLI_HOME=%~dp0.dotnet"
set "APPDATA=%~dp0.appdata"
title ParaliMitra - Stubble Burning Prevention Platform
echo ==========================================================
echo    ParaliMitra - Clean Air & Farmer Stubble Wealth
echo ==========================================================
echo Starting web server on http://localhost:5000 ...
start http://localhost:5000
"C:\Program Files\dotnet\dotnet.exe" run --project "%~dp0parali-mitra.csproj" --no-restore
pause
