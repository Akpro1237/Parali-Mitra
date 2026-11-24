@echo off
set "DOTNET_CLI_HOME=%~dp0..\parali-mitra\.dotnet"
set "APPDATA=%~dp0..\parali-mitra\.appdata"
title Parali Response Registry (Port 5001)
echo ==========================================================
echo    Parali Response Registry - Dedicated Recording Site
echo ==========================================================
echo Starting Response Portal on http://localhost:5001 ...
start http://localhost:5001
"C:\Program Files\dotnet\dotnet.exe" run --project "%~dp0parali-responses.csproj" --no-restore
pause
