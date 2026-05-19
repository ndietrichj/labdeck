Set-Location "C:\Users\ndiet\source\repos\labdeck"

Write-Host ""
Write-Host "================================="
Write-Host "       LABDECK DEV LAUNCHER"
Write-Host "================================="
Write-Host ""

# Kill old LabDeck processes
Get-Process labdeck,node,labdeck-backend -ErrorAction SilentlyContinue |
    Stop-Process -Force -ErrorAction SilentlyContinue

# Kill anything owning the backend port
Get-NetTCPConnection -LocalPort 8790 -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 2

# Environment
$env:LABDECK_PORT="8790"
$env:HOMELAB_STATUS_URL="http://10.0.0.220:8787/public-status.json"

# Launch
npm run tauri:dev
