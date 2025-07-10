@echo off
title Fulbito Championship - Backend Server

echo ===============================================
echo     FULBITO CHAMPIONSHIP 2025 - BACKEND
echo ===============================================
echo.

echo 📁 Navegando al directorio backend...
cd /d "%~dp0backend"
echo ✅ En directorio backend

echo.
echo  Iniciando servidor backend...
echo.
echo 🌐 Backend estará disponible en: http://localhost:8000
echo 📋 Admin panel en: http://localhost:8000/admin
echo 🛠️  API endpoints en: http://localhost:8000/api/
echo.
echo ⚠️  Los datos se crean automáticamente al acceder a los endpoints
echo ⏹️  Presiona Ctrl+C para detener el servidor
echo.

python start_server.py
