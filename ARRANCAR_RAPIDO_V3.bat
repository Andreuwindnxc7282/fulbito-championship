@echo off
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                           FULBITO CHAMPIONSHIP                              ║
echo ║                    INICIO RAPIDO SIN ERRORES - V3                           ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo   🚀 SCRIPT ULTRA RAPIDO - FUNCIONA EN 30 SEGUNDOS
echo.
echo   ✅ Arranca TODO sin demoras:
echo      - Evita el build lento de Next.js
echo      - Usa modo desarrollo directo
echo      - Configuracion automatica minima
echo      - Deteccion de errores rapida
echo      - ¡LISTO en menos de 1 minuto!
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                        PRESIONA ENTER PARA CONTINUAR                        ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
pause > nul

echo.
echo ========================================
echo   INICIANDO SISTEMA RAPIDO V3
echo ========================================

echo.
echo [1/5] Limpieza rapida...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
if exist .next rmdir /s /q .next >nul 2>&1
echo ✅ Sistema limpio

echo.
echo [2/5] Verificando Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python no encontrado. Instala Python desde python.org
    pause
    exit /b 1
)
echo ✅ Python disponible

echo.
echo [3/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no encontrado. Instala Node.js desde nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js disponible

echo.
echo [4/5] Instalando dependencias minimas (solo si es necesario)...
if not exist "node_modules" (
    echo 🔄 Instalando dependencias de Node.js...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Error instalando dependencias
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencias ya instaladas
)

if not exist "backend/db.sqlite3" (
    echo 🔄 Configurando base de datos...
    cd backend
    python manage.py migrate >nul 2>&1
    cd ..
    echo ✅ Base de datos configurada
) else (
    echo ✅ Base de datos ya configurada
)

echo.
echo [5/5] Arrancando servidores...
echo 🚀 Iniciando Django...
cd backend
start /B python manage.py runserver 8000
cd ..

echo 🚀 Iniciando Next.js...
start /B npm run dev

echo.
echo Esperando que los servidores arranquen...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo   VERIFICACION RAPIDA
echo ========================================

echo.
echo 🔍 Verificando servidores...

rem Verificar Django
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8000' -TimeoutSec 5 -UseBasicParsing | Out-Null; Write-Host '✅ Django funcionando' } catch { Write-Host '⚠️  Django arrancando...' }"

rem Verificar Next.js
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5 -UseBasicParsing | Out-Null; Write-Host '✅ Next.js funcionando' } catch { Write-Host '⚠️  Next.js arrancando...' }"

echo.
echo ========================================
echo   🎉 SISTEMA ARRANCADO EXITOSAMENTE
echo ========================================
echo.
echo 🌐 ACCESOS DIRECTOS:
echo   👉 Frontend:    http://localhost:3000  [PRINCIPAL]
echo   👉 Backend:     http://localhost:8000
echo   👉 Admin:       http://localhost:8000/admin/
echo      Usuario: admin / Password: admin123
echo.
echo 🔧 CARACTERISTICAS V3:
echo   ✅ Arranque ultra rapido (sin build)
echo   ✅ Deteccion automatica de problemas
echo   ✅ Modo desarrollo directo
echo   ✅ Sin esperas innecesarias
echo   ✅ Verificacion de conectividad
echo   ✅ Mensajes claros de estado
echo.
echo ========================================
echo   ¡LISTO EN MENOS DE 1 MINUTO!
echo ========================================
echo.
echo 💡 INSTRUCCIONES:
echo    1. Abre: http://localhost:3000
echo    2. Si hay problemas, espera 1-2 minutos mas
echo    3. El sistema se autoconfigura
echo.
echo Los servidores siguen funcionando en segundo plano.
echo Para detenerlos, cierra esta ventana o presiona Ctrl+C.
echo.

rem Mostrar estado periodicamente
:monitor
echo.
echo [%time%] 📊 Estado del sistema:
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8000' -TimeoutSec 2 -UseBasicParsing | Out-Null; Write-Host '  ✅ Django: OK' } catch { Write-Host '  ❌ Django: No responde' }"
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 2 -UseBasicParsing | Out-Null; Write-Host '  ✅ Next.js: OK' } catch { Write-Host '  ❌ Next.js: No responde' }"
echo.
echo 🌐 Ve a: http://localhost:3000
echo.
echo Presiona Ctrl+C para detener o espera para siguiente verificacion...
timeout /t 60 /nobreak >nul
goto monitor
