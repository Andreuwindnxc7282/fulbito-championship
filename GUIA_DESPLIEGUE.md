# 🚀 Guía Completa de Despliegue - Fulbito Championship

## 📋 Resumen del Proyecto

**Fulbito Championship** es un sistema completo de gestión de campeonatos con:
- **Backend**: Django REST API con JWT, PostgreSQL
- **Frontend**: Next.js con TypeScript, TailwindCSS
- **Características**: CRUD jugadores, estadísticas, dashboard admin, autenticación

---

## 🔄 PASO 1: DEPLOYMENT BACKEND EN RENDER

### 1.1 Crear cuenta en Render
1. Ve a [render.com](https://render.com)
2. Crea cuenta gratuita con GitHub
3. Conecta tu cuenta de GitHub

### 1.2 Crear Web Service
1. En Render Dashboard, click **"New"** → **"Web Service"**
2. Conecta repositorio: `Andreuwindnxc7282/fulbito-championship`
3. Configurar servicio:
   - **Name**: `fulbito-backend`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn fulbito.wsgi:application --bind 0.0.0.0:$PORT`

### 1.3 Variables de Entorno
En la sección **Environment Variables**:

```env
SECRET_KEY=tu-clave-secreta-super-segura-aqui
DEBUG=False
DJANGO_SETTINGS_MODULE=fulbito.settings_prod
ADMIN_PASSWORD=admin123
ALLOWED_HOST=fulbito-backend.onrender.com
```

### 1.4 Plan y Deploy
1. Selecciona **Free Plan** (suficiente para desarrollo)
2. Click **"Create Web Service"**
3. Render automáticamente:
   - Clona el repositorio
   - Ejecuta `build.sh`
   - Instala dependencias
   - Configura PostgreSQL
   - Ejecuta migraciones
   - Crea superusuario

---

## 🎯 PASO 2: DEPLOYMENT FRONTEND EN VERCEL

### 2.1 Preparar Frontend
1. Ve a tu proyecto local
2. Actualiza `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://fulbito-backend.onrender.com
NEXT_PUBLIC_FRONTEND_URL=https://fulbito-championship.vercel.app
```

### 2.2 Deploy en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Conecta con GitHub
3. Importa proyecto: `Andreuwindnxc7282/fulbito-championship`
4. Configurar:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./` (raíz del proyecto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2.3 Variables de Entorno en Vercel
En Project Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://fulbito-backend.onrender.com
NEXT_PUBLIC_FRONTEND_URL=https://fulbito-championship.vercel.app
```

### 2.4 Deploy
1. Click **"Deploy"**
2. Vercel construirá y desplegará automáticamente
3. Obtienes URL: `https://fulbito-championship.vercel.app`

---

## 🔧 PASO 3: CONFIGURACIÓN POST-DEPLOY

### 3.1 Actualizar CORS en Backend
Cuando tengas la URL de Vercel, actualiza `settings_prod.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://fulbito-championship.vercel.app",  # TU URL REAL
]
```

### 3.2 Redeploy Backend
1. Haz commit y push de los cambios
2. Render redesplegará automáticamente

---

## ✅ PASO 4: VERIFICACIÓN

### 4.1 URLs Esperadas
- **Backend**: `https://fulbito-backend.onrender.com`
- **API Admin**: `https://fulbito-backend.onrender.com/admin/`
- **Swagger**: `https://fulbito-backend.onrender.com/swagger/`
- **Frontend**: `https://fulbito-championship.vercel.app`

### 4.2 Pruebas Básicas
1. **API Health**: `GET https://fulbito-backend.onrender.com/api/health/`
2. **Login**: `POST https://fulbito-backend.onrender.com/api/auth/login/`
3. **Admin Panel**: Accede con `admin/admin123`
4. **Frontend**: Prueba login y dashboard

---

## 🛠️ COMANDOS ÚTILES

### Verificar Deploy Local
```bash
# Verificar backend
python backend/verify_deployment.py

# Probar API
python backend/test_endpoints.py
```

### Logs en Render
- Ve a tu servicio en Render
- Click en **"Logs"** para ver errores
- Útil para debugging

### Redeploy Manual
- En Render: Click **"Manual Deploy"**
- En Vercel: Click **"Redeploy"**

---

## 🚨 TROUBLESHOOTING

### Error 500 en Backend
1. Revisa logs en Render
2. Verifica variables de entorno
3. Asegúrate que PostgreSQL esté conectado

### Error CORS en Frontend
1. Verifica `CORS_ALLOWED_ORIGINS` en settings
2. Usa la URL exacta de Vercel (con https)

### Build Fails
1. Verifica que `build.sh` tenga permisos
2. Revisa `requirements_prod.txt`
3. Chequea sintaxis en `settings_prod.py`

---

## 📊 ESTADO ACTUAL

✅ **Completado**:
- Archivos de deployment creados
- GitHub repo configurado
- Scripts de build listos
- Documentación completa

🔄 **En Progreso**:
- Deployment en Render
- Configuración de PostgreSQL
- Conexión Frontend-Backend

🎯 **Próximos Pasos**:
1. Crear Web Service en Render
2. Deploy Frontend en Vercel
3. Configurar CORS
4. Pruebas finales

---

## 📞 SOPORTE

Si encuentras errores:
1. Revisa logs en Render/Vercel
2. Verifica variables de entorno
3. Asegúrate que las URLs sean correctas
4. Consulta esta guía para troubleshooting

**¡El deployment está listo! Solo faltan los pasos finales en las plataformas.** 🚀
