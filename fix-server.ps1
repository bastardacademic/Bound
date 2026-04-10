# Bound Server Fix Script
# Run from: D:\MEGA\MEGAsync\GitHub\Bound

$root = Get-Location

Write-Host ""
Write-Host "=== STEP 1: Replacing broken server files ===" -ForegroundColor Cyan

Copy-Item -Path ".\app.js"       -Destination ".\server\src\app.js"    -Force
Write-Host "  Replaced: server\src\app.js" -ForegroundColor Green

Copy-Item -Path ".\server.js"    -Destination ".\server\server.js"     -Force
Write-Host "  Replaced: server\server.js" -ForegroundColor Green

Copy-Item -Path ".\package.json" -Destination ".\server\package.json"  -Force
Write-Host "  Replaced: server\package.json" -ForegroundColor Green

Write-Host ""
Write-Host "=== STEP 2: Installing server dependencies ===" -ForegroundColor Cyan
Push-Location ".\server"
npm install
Pop-Location

Write-Host ""
Write-Host "=== STEP 3: Generating VAPID keys ===" -ForegroundColor Cyan

$vapidScript = "const wp = require('web-push'); const keys = wp.generateVAPIDKeys(); console.log(JSON.stringify(keys));"
$vapidOutput = node -e $vapidScript 2>$null

if ($vapidOutput) {
    $keys = $vapidOutput | ConvertFrom-Json
    Write-Host ""
    Write-Host "  Copy these into server\.env:" -ForegroundColor Yellow
    Write-Host "  VAPID_PUBLIC_KEY=$($keys.publicKey)"
    Write-Host "  VAPID_PRIVATE_KEY=$($keys.privateKey)"
    Write-Host ""
} else {
    Write-Host "  VAPID key generation failed - run manually after install" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== STEP 4: Setting up server\.env ===" -ForegroundColor Cyan

$envPath = ".\server\.env"
if (-not (Test-Path $envPath)) {
    $envContent = @(
        "PORT=3000",
        "NODE_ENV=development",
        "",
        "POSTGRES_USER=bounduser",
        "POSTGRES_PASSWORD=boundpass",
        "POSTGRES_DB=bounddb",
        "DATABASE_URL=postgres://bounduser:boundpass@localhost:5432/bounddb",
        "",
        "JWT_SECRET=replace-this-with-a-long-random-string",
        "JWT_EXPIRES_IN=7d",
        "BCRYPT_ROUNDS=12",
        "",
        "CORS_ORIGIN=http://localhost:5173",
        "",
        "VAPID_PUBLIC_KEY=",
        "VAPID_PRIVATE_KEY="
    )
    $envContent | Out-File -FilePath $envPath -Encoding utf8
    Write-Host "  Created: server\.env" -ForegroundColor Green
    Write-Host "  Fill in JWT_SECRET and VAPID keys before starting" -ForegroundColor Red
} else {
    Write-Host "  Skipped: server\.env already exists" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Green
Write-Host ""
Write-Host "Start the backend (terminal 1):" -ForegroundColor Cyan
Write-Host "  cd server"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Start the frontend (terminal 2):" -ForegroundColor Cyan
Write-Host "  cd frontend"
Write-Host "  npm install"
Write-Host "  npm run dev"