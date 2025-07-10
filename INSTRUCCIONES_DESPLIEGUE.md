# 🚀 DESPLIEGUE PÚBLICO - Proyecto Fulbito Championship

## 📋 PASOS PARA COMPLETAR EL DESPLIEGUE

### ✅ ARCHIVOS PREPARADOS PARA DESPLIEGUE

Ya se han creado todos los archivos necesarios:

- ✅ `backend/settings_prod.py` - Configuración de producción
- ✅ `backend/build.sh` - Script de build para Render
- ✅ `backend/Procfile` - Configuración de proceso
- ✅ `backend/requirements_prod.txt` - Dependencias de producción
- ✅ `vercel.json` - Configuración para Vercel
- ✅ `.env.production` - Variables de entorno
- ✅ `.github/workflows/deploy.yml` - CI/CD (si existe)

---

## 🌐 PASO 1: DESPLEGAR BACKEND EN RENDER

### 1. Subir a GitHub
```bash
# Desde la raíz del proyecto
git init
git add .
git commit -m "Preparado para despliegue"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/fulbito-championship.git
git push -u origin main
```

### 2. Configurar en Render
1. Ve a https://render.com
2. Crea una cuenta gratuita
3. "New Web Service" → "Build and deploy from a Git repository"
4. Conecta tu repositorio de GitHub
5. Configuración:
   - **Name**: `fulbito-backend`
   - **Environment**: Python 3
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn fulbito.wsgi:application`
   - **Root Directory**: `backend`

### 3. Variables de Entorno en Render
```
DJANGO_SETTINGS_MODULE=fulbito.settings_prod
SECRET_KEY=tu-clave-secreta-muy-larga-y-segura-12345
PYTHONPATH=/opt/render/project/src
```

### 4. Agregar PostgreSQL
- En Render Dashboard → "New PostgreSQL"
- Copiar la `DATABASE_URL` generada
- Agregar como variable de entorno en tu Web Service

---

## 🎨 PASO 2: DESPLEGAR FRONTEND EN VERCEL

### 1. Configurar en Vercel
1. Ve a https://vercel.com
2. Crea una cuenta gratuita
3. "New Project" → Import Git Repository
4. Selecciona tu repositorio
5. Configuración automática (Next.js detectado)

### 2. Variables de Entorno en Vercel
```
NEXT_PUBLIC_API_URL=https://fulbito-backend.onrender.com/api
NEXT_PUBLIC_BASE_URL=https://fulbito-backend.onrender.com
```

### 3. Actualizar CORS en Backend
Una vez obtengas la URL de Vercel, actualiza `CORS_ALLOWED_ORIGINS` en `settings_prod.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "https://tu-proyecto.vercel.app",  # Tu URL real de Vercel
    "http://localhost:3000",
]
```

---

## 🔧 PASO 3: VERIFICAR FUNCIONAMIENTO

### URLs Esperadas:
- **Backend**: https://fulbito-backend.onrender.com
- **API Docs**: https://fulbito-backend.onrender.com/swagger/
- **Admin Panel**: https://fulbito-backend.onrender.com/admin/
- **Frontend**: https://tu-proyecto.vercel.app

### Credenciales por defecto:
- **Usuario**: admin
- **Contraseña**: admin123

### Pruebas a realizar:
1. ✅ Backend responde en `/api/`
2. ✅ Swagger accesible
3. ✅ Admin panel funciona
4. ✅ Frontend carga correctamente
5. ✅ Login funciona
6. ✅ Dashboard muestra datos
7. ✅ CRUD de jugadores funciona

---

## ⚡ COMANDOS ÚTILES

### Para hacer cambios y redesplegar:
```bash
# Hacer cambios
git add .
git commit -m "Actualización"
git push

# Render y Vercel se actualizan automáticamente
```

### Para debugging en Render:
- Ve a tu servicio en Render
- Pestaña "Logs" para ver errores
- Pestaña "Events" para ver deploys

---

## 🎯 CHECKLIST FINAL

### ✅ Backend (Render)
- [ ] Repositorio subido a GitHub
- [ ] Web Service creado en Render
- [ ] PostgreSQL configurado
- [ ] Variables de entorno agregadas
- [ ] Build exitoso
- [ ] API respondiendo

### ✅ Frontend (Vercel)
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Sitio web accesible

### ✅ Integración
- [ ] Frontend se conecta al backend
- [ ] CORS configurado correctamente
- [ ] Login funciona
- [ ] Todas las funcionalidades operativas

---

## 🏆 RESULTADO ESPERADO

Una vez completado, tendrás:
- ✅ **Backend público** en Render con PostgreSQL
- ✅ **Frontend público** en Vercel
- ✅ **URLs públicas** funcionando
- ✅ **30/30 puntos** en el proyecto integrador

---

## 📞 AYUDA

Si necesitas ayuda con algún paso:
1. Revisa los logs en Render/Vercel
2. Verifica las variables de entorno
3. Confirma que las URLs estén correctas
4. Revisa la configuración de CORS

¡Tu proyecto estará 100% completo! 🎉
