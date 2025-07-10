# Guía de Despliegue - Proyecto Fulbito Championship

## 🚀 CONFIGURACIÓN PARA DESPLIEGUE PÚBLICO

### 📋 Servicios a Utilizar
- **Backend**: Render (Django + PostgreSQL)
- **Frontend**: Vercel (React/Next.js)
- **Base de Datos**: PostgreSQL en Render

---

## 🔧 PASO 1: PREPARAR BACKEND PARA RENDER

### 1.1 Crear archivo requirements.txt actualizado
```bash
cd backend
pip freeze > requirements.txt
```

### 1.2 Configurar settings para producción
Crear `backend/fulbito/settings_prod.py`:

```python
from .settings import *
import os
import dj_database_url

# CONFIGURACIÓN DE PRODUCCIÓN
DEBUG = False
ALLOWED_HOSTS = ['*']

# Base de datos PostgreSQL
DATABASES = {
    'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))
}

# Configuración de archivos estáticos
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# CORS para frontend desplegado
CORS_ALLOWED_ORIGINS = [
    "https://fulbito-championship.vercel.app",  # Cambiar por tu URL de Vercel
    "http://localhost:3000",  # Para desarrollo local
]

# JWT para producción
SIMPLE_JWT.update({
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
})
```

### 1.3 Crear build.sh para Render
```bash
#!/usr/bin/env bash
# build.sh

set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py loaddata initial_data.json
```

### 1.4 Crear Dockerfile (opcional)
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN python manage.py collectstatic --no-input

EXPOSE 8000
CMD ["gunicorn", "fulbito.wsgi:application", "--bind", "0.0.0.0:8000"]
```

---

## 🌐 PASO 2: PREPARAR FRONTEND PARA VERCEL

### 2.1 Actualizar variables de entorno
Crear `.env.local`:
```
NEXT_PUBLIC_API_URL=https://fulbito-backend.onrender.com/api
NEXT_PUBLIC_BASE_URL=https://fulbito-backend.onrender.com
```

### 2.2 Crear vercel.json
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "app/[[...slug]]/route.ts": {
      "maxDuration": 30
    }
  }
}
```

---

## 📦 PASO 3: DESPLEGAR EN RENDER

### 3.1 Preparar repositorio
1. Subir proyecto a GitHub
2. Asegurar que `build.sh` tenga permisos de ejecución

### 3.2 Configurar en Render
1. Ir a https://render.com
2. Crear cuenta/iniciar sesión
3. "New Web Service" → Conectar GitHub
4. Seleccionar repositorio
5. Configurar:
   - **Name**: fulbito-backend
   - **Environment**: Python 3
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn fulbito.wsgi:application`
   - **Plan**: Free

### 3.3 Variables de entorno en Render
```
DJANGO_SETTINGS_MODULE=fulbito.settings_prod
SECRET_KEY=tu-secret-key-super-segura
DATABASE_URL=(auto-generada por Render)
```

---

## 🚀 PASO 4: DESPLEGAR EN VERCEL

### 4.1 Configurar en Vercel
1. Ir a https://vercel.com
2. Crear cuenta/iniciar sesión
3. "New Project" → Import Git Repository
4. Seleccionar repositorio
5. Configurar:
   - **Framework**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`

### 4.2 Variables de entorno en Vercel
```
NEXT_PUBLIC_API_URL=https://fulbito-backend.onrender.com/api
NEXT_PUBLIC_BASE_URL=https://fulbito-backend.onrender.com
```

---

## 🔄 PASO 5: CONFIGURAR CI/CD

### 5.1 Crear GitHub Actions
`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build frontend
      run: npm run build
      
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📋 CHECKLIST DE DESPLIEGUE

### ✅ Backend (Render)
- [ ] `requirements.txt` actualizado
- [ ] `settings_prod.py` configurado
- [ ] `build.sh` creado
- [ ] Variables de entorno configuradas
- [ ] PostgreSQL configurado
- [ ] CORS actualizado

### ✅ Frontend (Vercel)
- [ ] `.env.local` configurado
- [ ] `vercel.json` creado
- [ ] URLs del backend actualizadas
- [ ] Build funcionando localmente

### ✅ Integración
- [ ] Backend desplegado y funcionando
- [ ] Frontend desplegado y funcionando
- [ ] Comunicación entre frontend y backend
- [ ] Autenticación JWT funcionando
- [ ] Base de datos poblada

---

## 🎯 URLS FINALES ESPERADAS

- **Backend**: https://fulbito-backend.onrender.com
- **Frontend**: https://fulbito-championship.vercel.app
- **API Docs**: https://fulbito-backend.onrender.com/swagger/
- **Admin**: https://fulbito-backend.onrender.com/admin/

---

¿Quieres que empecemos con algún paso específico?
