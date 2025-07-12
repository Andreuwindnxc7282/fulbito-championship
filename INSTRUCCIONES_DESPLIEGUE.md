# 📝 Instrucciones de Despliegue - Paso a Paso

## 🎯 OBJETIVO
Desplegar el sistema **Fulbito Championship** en producción usando:
- **Render** (Backend Django)
- **Vercel** (Frontend Next.js)

---

## 🚀 PASO A PASO - RENDER (BACKEND)

### 1. Acceso a Render
1. Abre tu navegador y ve a: https://render.com
2. Click en **"Get Started for Free"**
3. Selecciona **"GitHub"** para conectar tu cuenta
4. Autoriza el acceso a tu repositorio

### 2. Crear Web Service
1. En el dashboard de Render, click **"New"** (botón azul)
2. Selecciona **"Web Service"**
3. Busca y selecciona: `Andreuwindnxc7282/fulbito-championship`
4. Click **"Connect"**

### 3. Configurar el Servicio
Completa el formulario con estos datos exactos:

```
Name: fulbito-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: ./build.sh
Start Command: gunicorn fulbito.wsgi:application --bind 0.0.0.0:$PORT
```

### 4. Variables de Entorno
En la sección **"Environment Variables"**, agrega:

```
SECRET_KEY = django-insecure-your-secret-key-here-change-in-production
DEBUG = False
DJANGO_SETTINGS_MODULE = fulbito.settings_prod
ADMIN_PASSWORD = admin123
```

### 5. Crear Servicio
1. Selecciona **"Free"** plan
2. Click **"Create Web Service"**
3. Espera que termine el build (5-10 minutos)
4. Anota la URL que te asigna Render

---

## 🌐 PASO A PASO - VERCEL (FRONTEND)

### 1. Acceso a Vercel
1. Ve a: https://vercel.com
2. Click **"Start Deploying"**
3. Selecciona **"Continue with GitHub"**
4. Autoriza el acceso

### 2. Importar Proyecto
1. Click **"Add New..."** → **"Project"**
2. Busca: `Andreuwindnxc7282/fulbito-championship`
3. Click **"Import"**

### 3. Configurar Proyecto
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 4. Variables de Entorno
En **"Environment Variables"**:

```
NEXT_PUBLIC_API_URL = https://TU-URL-DE-RENDER.onrender.com
NEXT_PUBLIC_FRONTEND_URL = https://TU-PROYECTO.vercel.app
```

**⚠️ IMPORTANTE**: Reemplaza con tus URLs reales

### 5. Deploy
1. Click **"Deploy"**
2. Espera que termine (3-5 minutos)
3. Anota tu URL de Vercel

---

## 🔧 CONFIGURACIÓN FINAL

### 1. Actualizar CORS
Con tu URL de Vercel, actualiza el backend:

1. Ve a tu proyecto local
2. Edita `backend/fulbito/settings_prod.py`
3. Actualiza esta línea:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://TU-URL-VERCEL.vercel.app",  # 👈 TU URL REAL
]
```

### 2. Redeploy Backend
1. Guarda los cambios
2. Haz commit: `git add . && git commit -m "Update CORS for production"`
3. Push: `git push origin main`
4. Render redesplegará automáticamente

---

## ✅ VERIFICACIÓN

### URLs a Probar
Reemplaza con tus URLs reales:

1. **Backend API**: `https://TU-BACKEND.onrender.com/api/health/`
2. **Admin Django**: `https://TU-BACKEND.onrender.com/admin/`
3. **Swagger**: `https://TU-BACKEND.onrender.com/swagger/`
4. **Frontend**: `https://TU-FRONTEND.vercel.app`

### Pruebas Básicas
1. **Admin Panel**: 
   - Usuario: `admin`
   - Password: `admin123`
   
2. **Frontend Login**:
   - Mismo usuario/password
   - Dashboard debe cargar con datos

3. **API Endpoints**:
   - `/api/players/` - Lista de jugadores
   - `/api/matches/` - Lista de partidos
   - `/api/standings/` - Tabla de posiciones

---

## 🚨 ERRORES COMUNES

### "Application Error" en Render
- Revisa los logs en Render
- Verifica que `build.sh` tenga permisos
- Chequea variables de entorno

### "CORS Error" en Frontend
- Verifica `CORS_ALLOWED_ORIGINS` en settings
- Usa https:// en las URLs
- Redeploy backend después de cambios

### "Build Failed" en Vercel
- Verifica que `package.json` esté en la raíz
- Chequea que las variables de entorno estén correctas
- Asegúrate que la URL del backend sea correcta

---

## 📞 SIGUIENTE PASO

**¡Ahora sigue estos pasos exactos!**

1. **Primero**: Deploy backend en Render
2. **Segundo**: Deploy frontend en Vercel
3. **Tercero**: Actualizar CORS con URL real
4. **Cuarto**: Verificar que todo funcione

**¿Listo para comenzar?** 🚀

Empezamos con Render. Ve al navegador y sigue el "PASO A PASO - RENDER" de arriba.
