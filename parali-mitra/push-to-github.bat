@echo off
set "GIT_EXE=%~dp0..\mingit\cmd\git.exe"
title Push ParaliMitra to GitHub
echo ==========================================================
echo       🌾 Push ParaliMitra Project to GitHub 🚀
echo ==========================================================
echo.
echo Step 1: Create a new repository on GitHub:
echo         https://github.com/new
echo         (Leave "Initialize this repository with README" UNCHECKED)
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/YOUR_USERNAME/parali-mitra.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL provided. Operation cancelled.
    pause
    exit /b
)

echo.
echo Linking repository to %REPO_URL% ...
"%GIT_EXE%" remote remove origin 2>nul
"%GIT_EXE%" remote add origin %REPO_URL%
"%GIT_EXE%" branch -M main

echo.
echo Pushing project files to GitHub...
"%GIT_EXE%" push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ==========================================================
    echo [SUCCESS] Your website is now launched on GitHub!
    echo View your code at: %REPO_URL%
    echo ==========================================================
) else (
    echo ==========================================================
    echo [INFO] If prompted for credentials, use your GitHub Username
    echo and a Personal Access Token (PAT) from:
    echo https://github.com/settings/tokens
    echo ==========================================================
)
pause
