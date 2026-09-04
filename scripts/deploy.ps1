# ==============================================================================
# Honey Chain — Production Deployment Script (PowerShell)
# ==============================================================================

Write-Host "============================================================" -ForegroundColor Yellow
Write-Host "🍯 Deploying Honey Chain Platform" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Host "Found Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Error "❌ Error: Docker is not installed or not running."
    exit 1
}

Write-Host "`n1. Building and launching production containers..." -ForegroundColor Cyan
docker compose down --remove-orphans
docker compose build
docker compose up -d

Write-Host "`n2. Waiting for services to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

Write-Host "`n3. Checking status..." -ForegroundColor Cyan
docker compose ps

Write-Host "`n============================================================" -ForegroundColor Green
Write-Host "✅ Honey Chain Platform Deployed Successfully!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000"
Write-Host "🚀 Backend API: http://localhost:5000 (Health: http://localhost:5000/api/health)"
Write-Host "🧠 AI Service: http://localhost:8000"
Write-Host "🐘 PostgreSQL: localhost:5432"
Write-Host "============================================================"
