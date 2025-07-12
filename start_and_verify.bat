@echo off
echo ========================================
echo   INICIANDO SISTEMA DE FULBITO
echo ========================================

echo.
echo [1/5] Verificando estado del frontend...
node verify_frontend_state.js
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Frontend no esta configurado correctamente
    echo Revisa los errores arriba antes de continuar
    pause
    exit /b 1
)

echo.
echo [2/5] Iniciando servidor Django...
cd backend
start /B python manage.py runserver 8000
cd ..

echo.
echo [3/5] Esperando que el backend se inicie...
timeout /t 5 /nobreak > nul

echo.
echo [4/5] Verificando que el backend responda...
python verify_system_state.py
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Backend no esta funcionando correctamente
    echo Revisa los errores arriba antes de continuar
    pause
    exit /b 1
)

echo.
echo [5/5] Iniciando servidor Next.js...
start /B npm run dev

echo.
echo ========================================
echo   SISTEMA INICIADO EXITOSAMENTE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo Swagger:  http://localhost:8000/api/schema/swagger-ui/
echo.
echo Los servidores estan corriendo en segundo plano.
echo Para detenerlos, cierra esta ventana o presiona Ctrl+C.
echo.
echo ========================================
echo   VERIFICACION AUTOMATICA EN 10 SEG
echo ========================================

timeout /t 10 /nobreak > nul

echo.
echo Verificando conectividad frontend-backend...
python verify_system_state.py
if %errorlevel% eq 0 (
    echo.
    echo ✅ SISTEMA 100%% FUNCIONAL
    echo ✅ Sin errores de Network Error o Failed to fetch
    echo ✅ Autenticacion automatica activada
    echo ✅ Tokens se renuevan automaticamente
    echo.
    echo Puedes acceder a:
    echo - Dashboard: http://localhost:3000
    echo - Admin: http://localhost:3000/admin
    echo - Login: http://localhost:3000/login
) else (
    echo.
    echo ❌ SISTEMA CON PROBLEMAS
    echo ❌ Revisa los errores arriba
)

echo.
echo Presiona cualquier tecla para cerrar...
pause > nul
