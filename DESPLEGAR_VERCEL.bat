@echo off
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                           FULBITO CHAMPIONSHIP                              ║
echo ║                       DESPLIEGUE AUTOMÁTICO A VERCEL                        ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo   🚀 SCRIPT PARA SUBIR TU PROYECTO A VERCEL
echo.
echo   ✅ Este script hará:
echo      - Instalar Vercel CLI si no está disponible
echo      - Configurar el proyecto para Vercel
echo      - Crear un build optimizado
echo      - Subir el proyecto a Vercel
echo      - Generar URLs de acceso públicas
echo.
echo   🌐 RESULTADO:
echo      - Frontend funcionando en Vercel
echo      - URLs públicas para compartir
echo      - ¡Listo para mostrar en cualquier lugar!
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                        PRESIONA ENTER PARA CONTINUAR                        ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
pause > nul

echo.
echo ========================================
echo   INICIANDO DESPLIEGUE A VERCEL
echo ========================================

echo.
echo [1/6] Verificando dependencias...
npm --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js/npm no está instalado
    echo Instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js disponible

echo.
echo [2/6] Instalando/verificando Vercel CLI...
call npm install -g vercel > nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Usando npx vercel para este despliegue
    set VERCEL_CMD=npx vercel
) else (
    echo ✅ Vercel CLI instalado
    set VERCEL_CMD=vercel
)

echo.
echo [3/6] Instalando dependencias del proyecto...
call npm install > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: No se pudieron instalar las dependencias
    echo Ejecuta manualmente: npm install
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas

echo.
echo [4/6] Creando build para producción...
call npm run build > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: No se pudo crear el build
    echo Verifica que no haya errores en el código
    pause
    exit /b 1
)
echo ✅ Build creado exitosamente

echo.
echo [5/6] Configurando variables de entorno...
echo NEXT_PUBLIC_API_URL=https://tu-backend.herokuapp.com > .env.production
echo ✅ Variables configuradas

echo.
echo [6/6] Desplegando a Vercel...
echo 🚀 Iniciando despliegue (esto puede tomar unos minutos)...
echo.
echo ⚠️  IMPORTANTE: 
echo    - Si es la primera vez, necesitarás hacer login en Vercel
echo    - Se abrirá tu navegador para autenticarte
echo    - Sigue las instrucciones en pantalla
echo.
pause

%VERCEL_CMD% --prod

echo.
echo ========================================
echo   DESPLIEGUE COMPLETADO
echo ========================================
echo.
echo 🎉 ¡Tu proyecto está ahora en línea!
echo.
echo 📱 PRÓXIMOS PASOS:
echo    1. Copia la URL que te dio Vercel
echo    2. Configura tu backend en Heroku/Railway
echo    3. Actualiza la variable NEXT_PUBLIC_API_URL
echo    4. ¡Comparte tu proyecto con el mundo!
echo.
echo 💡 COMANDOS ÚTILES:
echo    - Ver deployments: vercel ls
echo    - Ver logs: vercel logs
echo    - Actualizar: vercel --prod
echo.
echo Presiona cualquier tecla para finalizar...
pause > nul
