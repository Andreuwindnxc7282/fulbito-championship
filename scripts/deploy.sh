#!/bin/bash

# Script de despliegue automatizado para FulbitoManager
# Uso: ./scripts/deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-staging}
echo "🚀 Desplegando FulbitoManager en ambiente: $ENVIRONMENT"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Verificar que estamos en la rama correcta
if [ "$ENVIRONMENT" = "production" ]; then
    BRANCH="main"
else
    BRANCH="develop"
fi

CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    error "Debes estar en la rama $BRANCH para desplegar en $ENVIRONMENT"
fi

# Verificar que no hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
    error "Hay cambios sin commitear. Por favor, commitea todos los cambios antes de desplegar."
fi

log "✅ Verificaciones de Git completadas"

# Backend - Django
log "📦 Desplegando Backend (Django)..."

cd backend

# Verificar variables de entorno
if [ "$ENVIRONMENT" = "production" ]; then
    if [ -z "$DATABASE_URL" ] || [ -z "$SECRET_KEY" ]; then
        error "Variables de entorno de producción no configuradas"
    fi
fi

# Instalar dependencias
log "📥 Instalando dependencias de Python..."
pip install -r requirements.txt

# Ejecutar migraciones
log "🗄️ Ejecutando migraciones..."
python manage.py migrate

# Recopilar archivos estáticos
log "📁 Recopilando archivos estáticos..."
python manage.py collectstatic --noinput

# Ejecutar tests
log "🧪 Ejecutando tests del backend..."
python manage.py test

log "✅ Backend desplegado exitosamente"

# Frontend - React
log "🎨 Desplegando Frontend (React)..."

cd ../frontend

# Instalar dependencias
log "📥 Instalando dependencias de Node.js..."
npm ci

# Ejecutar linting
log "🔍 Ejecutando linting..."
npm run lint

# Ejecutar tests
log "🧪 Ejecutando tests del frontend..."
npm run test

# Build de producción
log "🏗️ Construyendo aplicación..."
npm run build

log "✅ Frontend desplegado exitosamente"

# Despliegue específico por ambiente
if [ "$ENVIRONMENT" = "production" ]; then
    log "🌐 Desplegando a producción..."
    
    # Deploy backend a Railway/Render
    if command -v railway &> /dev/null; then
        log "🚂 Desplegando backend a Railway..."
        cd ../backend
        railway up
    fi
    
    # Deploy frontend a Vercel
    if command -v vercel &> /dev/null; then
        log "▲ Desplegando frontend a Vercel..."
        cd ../frontend
        vercel --prod
    fi
    
else
    log "🧪 Desplegando a staging..."
    
    # Deploy a ambientes de staging
    if command -v railway &> /dev/null; then
        cd ../backend
        railway up --service fulbito-backend-staging
    fi
    
    if command -v vercel &> /dev/null; then
        cd ../frontend
        vercel
    fi
fi

# Verificar despliegue
log "🔍 Verificando despliegue..."

# Health check del backend
if [ "$ENVIRONMENT" = "production" ]; then
    BACKEND_URL="https://fulbito-backend.railway.app"
    FRONTEND_URL="https://fulbito-frontend.vercel.app"
else
    BACKEND_URL="https://fulbito-backend-staging.railway.app"
    FRONTEND_URL="https://fulbito-frontend-staging.vercel.app"
fi

# Verificar que el backend responde
if curl -f -s "$BACKEND_URL/api/tournaments/" > /dev/null; then
    log "✅ Backend respondiendo correctamente"
else
    warning "⚠️ Backend no responde, verificar logs"
fi

# Verificar que el frontend responde
if curl -f -s "$FRONTEND_URL" > /dev/null; then
    log "✅ Frontend respondiendo correctamente"
else
    warning "⚠️ Frontend no responde, verificar logs"
fi

log "🎉 Despliegue completado exitosamente!"
log "🌐 Backend: $BACKEND_URL"
log "🎨 Frontend: $FRONTEND_URL"

# Notificación (opcional)
if command -v notify-send &> /dev/null; then
    notify-send "FulbitoManager" "Despliegue completado exitosamente en $ENVIRONMENT"
fi
