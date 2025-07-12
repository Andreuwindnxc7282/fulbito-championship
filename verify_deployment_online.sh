#!/bin/bash

# Deployment Verification Script
echo "🔍 Verificando Deployment de Fulbito Championship..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs to check (replace with your actual URLs)
BACKEND_URL="https://fulbito-backend.onrender.com"
FRONTEND_URL="https://fulbito-championship.vercel.app"

echo -e "${YELLOW}📊 Verificando Backend...${NC}"

# Check backend health
echo "🔸 Verificando API Health..."
curl -f -s "${BACKEND_URL}/api/health/" > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ API Health: OK${NC}"
else
    echo -e "${RED}❌ API Health: ERROR${NC}"
fi

# Check admin panel
echo "🔸 Verificando Admin Panel..."
curl -f -s "${BACKEND_URL}/admin/" > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Admin Panel: OK${NC}"
else
    echo -e "${RED}❌ Admin Panel: ERROR${NC}"
fi

# Check Swagger
echo "🔸 Verificando Swagger..."
curl -f -s "${BACKEND_URL}/swagger/" > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Swagger: OK${NC}"
else
    echo -e "${RED}❌ Swagger: ERROR${NC}"
fi

# Check API endpoints
echo "🔸 Verificando API Endpoints..."
curl -f -s "${BACKEND_URL}/api/players/" > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Players API: OK${NC}"
else
    echo -e "${RED}❌ Players API: ERROR${NC}"
fi

echo -e "${YELLOW}🌐 Verificando Frontend...${NC}"

# Check frontend
echo "🔸 Verificando Frontend..."
curl -f -s "${FRONTEND_URL}" > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend: OK${NC}"
else
    echo -e "${RED}❌ Frontend: ERROR${NC}"
fi

echo -e "${YELLOW}📝 Resumen de URLs:${NC}"
echo "🔗 Backend: ${BACKEND_URL}"
echo "🔗 Admin: ${BACKEND_URL}/admin/"
echo "🔗 Swagger: ${BACKEND_URL}/swagger/"
echo "🔗 Frontend: ${FRONTEND_URL}"

echo -e "${YELLOW}👤 Credenciales Admin:${NC}"
echo "Usuario: admin"
echo "Password: admin123"

echo -e "${GREEN}🎉 Verificación completada!${NC}"
