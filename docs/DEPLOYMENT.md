# Guía de Despliegue - Fulbito Championship

Esta guía detalla los pasos para desplegar la aplicación Fulbito Championship en producción.

## Requisitos Previos

- Cuenta en Railway o Render (backend)
- Cuenta en Vercel (frontend)
- Cuenta en GitHub
- PostgreSQL (base de datos)
- Redis (para WebSockets)

## Configuración de Variables de Entorno

### Backend (Railway/Render)

\`\`\`
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/nombre_db
SECRET_KEY=tu_clave_secreta_muy_segura
DEBUG=False
ALLOWED_HOST=tu-dominio-backend.railway.app
CORS_ALLOWED_ORIGINS=https://tu-dominio-frontend.vercel.app
REDIS_URL=redis://usuario:contraseña@host:puerto
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tu-email@gmail.com
EMAIL_HOST_PASSWORD=tu_contraseña_de_app
\`\`\`

### Frontend (Vercel)

\`\`\`
NEXT_PUBLIC_API_URL=https://tu-dominio-backend.railway.app/api
NEXT_PUBLIC_WS_URL=wss://tu-dominio-backend.railway.app
\`\`\`

## Despliegue del Backend

### Opción 1: Railway

1. Conecta tu repositorio de GitHub a Railway
2. Configura las variables de entorno
3. Configura el comando de inicio: `gunicorn fulbito.asgi:application -k uvicorn.workers.UvicornWorker`
4. Despliega la aplicación

### Opción 2: Render

1. Conecta tu repositorio de GitHub a Render
2. Selecciona "Web Service" y configura:
   - Runtime: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn fulbito.asgi:application -k uvicorn.workers.UvicornWorker`
3. Configura las variables de entorno
4. Despliega la aplicación

## Despliegue del Frontend

### Vercel

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno
3. Configura el framework como Next.js
4. Despliega la aplicación

## Base de Datos

### PostgreSQL en Railway

1. Crea un servicio PostgreSQL en Railway
2. Obtén la URL de conexión
3. Configura la variable de entorno `DATABASE_URL` en el backend

### Migración Inicial

\`\`\`bash
python manage.py migrate
\`\`\`

### Carga de Datos Iniciales

\`\`\`bash
python manage.py loaddata initial_data.json
\`\`\`

## Redis para WebSockets

1. Crea un servicio Redis en Railway o utiliza Upstash
2. Obtén la URL de conexión
3. Configura la variable de entorno `REDIS_URL` en el backend

## Configuración de CI/CD

### GitHub Actions

El archivo `.github/workflows/deploy.yml` ya está configurado para:

1. Ejecutar tests en cada push
2. Desplegar automáticamente a Railway/Render y Vercel en la rama main

### Configuración de Secretos en GitHub

Configura los siguientes secretos en tu repositorio de GitHub:

\`\`\`
RAILWAY_TOKEN
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
\`\`\`

## Verificación del Despliegue

1. Verifica que la API esté funcionando: `https://tu-dominio-backend.railway.app/api/docs/`
2. Verifica que el frontend esté funcionando: `https://tu-dominio-frontend.vercel.app`
3. Prueba la autenticación y las funcionalidades principales

## Monitoreo y Logs

### Railway/Render

- Accede a los logs desde el dashboard
- Configura alertas para errores

### Vercel

- Accede a los logs desde el dashboard
- Configura alertas para errores de construcción o despliegue

## Respaldo de Datos

Configura respaldos automáticos de la base de datos:

\`\`\`bash
# Ejemplo de script para respaldo diario
pg_dump -U usuario -d nombre_db > backup_$(date +%Y%m%d).sql
\`\`\`

## Actualización de la Aplicación

1. Realiza cambios en tu rama de desarrollo
2. Prueba los cambios localmente
3. Crea un Pull Request a la rama main
4. Después de la revisión, fusiona el PR
5. GitHub Actions desplegará automáticamente los cambios

## Rollback

En caso de problemas:

1. Railway/Render: Revierte a la versión anterior desde el dashboard
2. Vercel: Revierte a la versión anterior desde el dashboard

## Soporte y Mantenimiento

- Monitorea regularmente los logs
- Actualiza las dependencias periódicamente
- Realiza pruebas de seguridad
