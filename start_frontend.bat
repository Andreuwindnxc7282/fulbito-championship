@echo off
title Fulbito Championship - Frontend

echo ===============================================
echo     FULBITO CHAMPIONSHIP 2025 - FRONTEND
echo ===============================================
echo.

echo [1/2] 📦 Instalando dependencias (si es necesario)...
if not exist node_modules (
    echo Instalando dependencias...
    npm install
) else (
    echo ✅ Dependencias ya instaladas
)

echo.
echo [2/2] 🚀 Iniciando servidor de desarrollo...
echo.
echo 🌐 Frontend estará disponible en: http://localhost:3000
echo 📱 Interfaz web del campeonato de fulbito
echo.
echo ⏹️  Presiona Ctrl+C para detener el servidor
echo.

npm run dev
