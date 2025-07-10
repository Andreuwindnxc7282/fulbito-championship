@echo off
echo === INICIANDO SERVIDORES FULBITO CHAMPIONSHIP ===

echo Iniciando backend Django...
cd backend
start /B python manage.py runserver
timeout /t 5 /nobreak > nul

echo Verificando backend...
curl -s http://localhost:8000/api/public/standings/1/ > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend funcionando en http://localhost:8000
) else (
    echo ❌ Backend no responde, intentando nuevamente...
)

cd ..
echo Iniciando frontend Next.js...
start /B npm run dev

echo === SERVIDORES INICIADOS ===
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3002
echo.
echo Para detener, cierra estas ventanas de comandos
pause
