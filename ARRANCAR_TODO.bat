@echo off
echo ========================================
echo    FULBITO CHAMPIONSHIP - INICIO RAPIDO
echo ========================================
echo.
echo Arrancando Backend Django...
start "Django Backend" cmd /k "cd backend && python manage.py runserver"

echo.
echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo.
echo Arrancando Frontend Next.js...
start "Next.js Frontend" cmd /k "pnpm dev"

echo.
echo ========================================
echo    PROYECTO INICIADO CORRECTAMENTE
echo ========================================
echo.
echo URLs disponibles:
echo - Backend Admin: http://localhost:8000/admin/
echo - Frontend: http://localhost:3000
echo.
echo Usuario admin: admin
echo Password: admin123
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
