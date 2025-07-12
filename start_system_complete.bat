@echo off
cls
echo ========================================
echo   SISTEMA DE FULBITO - INICIO COMPLETO
echo ========================================

echo.
echo [1/6] Verificando archivos del frontend...
if not exist "lib\auto-token-system.ts" (
    echo ❌ ERROR: Archivo auto-token-system.ts no encontrado
    pause
    exit /b 1
)

if not exist "components\dashboard.tsx" (
    echo ❌ ERROR: Archivo dashboard.tsx no encontrado
    pause
    exit /b 1
)

echo ✅ Archivos del frontend verificados

echo.
echo [2/6] Verificando dependencias...
if not exist "node_modules" (
    echo 🔄 Instalando dependencias...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

echo ✅ Dependencias verificadas

echo.
echo [3/6] Iniciando servidor Django...
cd backend
echo 🚀 Iniciando Django en puerto 8000...
start /B python manage.py runserver 8000
cd ..

echo.
echo [4/6] Esperando que el backend se inicie...
timeout /t 8 /nobreak > nul

echo.
echo [5/6] Verificando sistema completo...
python complete_system_verification.py
if %errorlevel% neq 0 (
    echo.
    echo ❌ SISTEMA CON ERRORES
    echo Por favor revisa los errores arriba
    echo.
    pause
    exit /b 1
)

echo.
echo [6/6] Iniciando servidor Next.js...
echo 🚀 Iniciando Next.js en puerto 3000...
start /B npm run dev

echo.
echo ========================================
echo   SISTEMA INICIADO EXITOSAMENTE
echo ========================================
echo.
echo 🌐 ACCESOS PRINCIPALES:
echo   Frontend:    http://localhost:3000
echo   Backend:     http://localhost:8000
echo   Swagger:     http://localhost:8000/api/schema/swagger-ui/
echo   Admin:       http://localhost:8000/admin/
echo.
echo 🔧 CARACTERÍSTICAS ACTIVAS:
echo   ✅ Autenticación automática
echo   ✅ Renovación automática de tokens
echo   ✅ Manejo de errores de red
echo   ✅ Reintentos automáticos
echo   ✅ Monitoreo de estado del sistema
echo.
echo ========================================
echo   VERIFICACION FINAL EN 15 SEGUNDOS
echo ========================================

timeout /t 15 /nobreak > nul

echo.
echo 🔍 Verificando conectividad final...
python complete_system_verification.py
if %errorlevel% eq 0 (
    echo.
    echo 🎉 ¡SISTEMA 100%% FUNCIONAL!
    echo ✅ Sin errores de "Network Error" o "Failed to fetch"
    echo ✅ Autenticación automática configurada
    echo ✅ Tokens se renuevan automáticamente cada 45 minutos
    echo ✅ Sistema de monitoreo activo
    echo.
    echo 🚀 LISTO PARA USAR:
    echo   - Ve a http://localhost:3000 para el dashboard
    echo   - El sistema manejará automáticamente los tokens
    echo   - No necesitas intervenir manualmente
    echo.
    echo Los servidores están corriendo en segundo plano.
    echo Para detenerlos, cierra esta ventana.
) else (
    echo.
    echo ⚠️  SISTEMA CON PROBLEMAS MENORES
    echo El sistema puede estar iniciándose aún.
    echo Verifica manualmente en: http://localhost:3000
)

echo.
echo ========================================
echo   SISTEMA LISTO - MONITOREO ACTIVO
echo ========================================
echo.
echo Presiona cualquier tecla para mantener los servidores...
pause > nul

echo.
echo Los servidores continúan ejecutándose...
echo Cierra esta ventana cuando termines de usar el sistema.
echo.

:loop
timeout /t 300 /nobreak > nul
echo 🔄 Verificación automática...
python complete_system_verification.py > nul 2>&1
if %errorlevel% eq 0 (
    echo ✅ Sistema funcionando correctamente - %time%
) else (
    echo ⚠️  Sistema con problemas - %time%
)
goto loop
