$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent $PSScriptRoot
$source = Join-Path $repo "src-tauri\binaries\labdeck-backend-x86_64-pc-windows-msvc.exe"
$targetDir = Join-Path $repo "src-tauri\target\release"
$target = Join-Path $targetDir "labdeck-backend.exe"

if (!(Test-Path $source)) {
  throw "Missing sidecar source: $source"
}

New-Item -ItemType Directory -Force $targetDir | Out-Null
Copy-Item $source $target -Force

Write-Host "Copied sidecar:"
Write-Host "  from $source"
Write-Host "  to   $target"
