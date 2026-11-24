$env:DOTNET_CLI_HOME = "$PSScriptRoot\.dotnet"
$env:APPDATA = "$PSScriptRoot\.appdata"
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "   🌾 Starting ParaliMitra - Stubble Management Website   " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Web Server is starting on http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host ""

Start-Process "http://localhost:5000"

& "C:\Program Files\dotnet\dotnet.exe" run --project "$PSScriptRoot\parali-mitra.csproj" --no-restore
