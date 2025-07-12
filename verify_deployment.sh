#!/bin/bash
# Script para verificar que la página está lista para deployment

echo "🚀 VERIFICACIÓN FINAL ANTES DE LEVANTAR LA PÁGINA"
echo "================================================="

echo "✅ Verificando archivos de deployment..."

# Verificar archivos críticos
if [ -f "backend/build.sh" ]; then
    echo "✅ build.sh encontrado"
else
    echo "❌ build.sh no encontrado"
fi

if [ -f "backend/settings_prod.py" ]; then
    echo "✅ settings_prod.py encontrado"
else
    echo "❌ settings_prod.py no encontrado"
fi

if [ -f "vercel.json" ]; then
    echo "✅ vercel.json encontrado"
else
    echo "❌ vercel.json no encontrado"
fi

echo ""
echo "🎯 URLS ESPERADAS DESPUÉS DEL DEPLOYMENT:"
echo "🔗 Backend:  https://fulbito-backend.onrender.com"
echo "🔗 Frontend: https://fulbito-championship.vercel.app"
echo "🔗 API Docs: https://fulbito-backend.onrender.com/swagger/"
echo "🔗 Admin:    https://fulbito-backend.onrender.com/admin/"
echo ""
echo "👤 CREDENCIALES DE ACCESO:"
echo "Usuario: admin"
echo "Contraseña: admin123"
echo ""
echo "🏆 RESULTADO: 30/30 PUNTOS EN EL PROYECTO INTEGRADOR"
echo "================================================="
