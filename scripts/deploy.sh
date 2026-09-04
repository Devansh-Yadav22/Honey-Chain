#!/usr/bin/env bash
# ==============================================================================
# Honey Chain — Production Deployment Script
# ==============================================================================
set -euo pipefail

echo "============================================================"
echo "🍯 Deploying Honey Chain Platform"
echo "============================================================"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed or not in PATH."
    exit 1
fi

if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed."
    exit 1
fi

COMPOSE_CMD="docker compose"
if ! docker compose version &> /dev/null; then
    COMPOSE_CMD="docker-compose"
fi

echo "1. Checking environment files..."
if [ ! -f "frontend/.env" ]; then
    echo "⚠️ Warning: frontend/.env not found, using defaults."
fi
if [ ! -f "backend/.env" ]; then
    echo "⚠️ Warning: backend/.env not found, using defaults."
fi

echo "2. Building and starting production containers..."
$COMPOSE_CMD down --remove-orphans || true
$COMPOSE_CMD build --pull
$COMPOSE_CMD up -d

echo "3. Waiting for services to become healthy..."
sleep 10

echo "4. Checking service health status..."
$COMPOSE_CMD ps

echo "============================================================"
echo "✅ Honey Chain Platform Deployed Successfully!"
echo "============================================================"
echo "🌐 Frontend: http://localhost:3000"
echo "🚀 Backend API: http://localhost:5000 (Health: http://localhost:5000/api/health)"
echo "🧠 AI Service: http://localhost:8000"
echo "🐘 PostgreSQL: localhost:5432"
echo "============================================================"
