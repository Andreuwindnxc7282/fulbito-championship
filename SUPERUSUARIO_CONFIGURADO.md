# 🔐 SUPERUSUARIO DJANGO CONFIGURADO

## 📋 Credenciales del Superusuario

### 👤 Datos de Acceso
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Email:** `admin@fulbito.com`
- **Rol:** Superusuario (todos los permisos)

### 🌐 Accesos Disponibles

#### 🔧 Panel de Administración Django
- **URL:** http://localhost:8000/admin/
- **Descripción:** Acceso completo a la base de datos
- **Funcionalidades:**
  - Gestión de usuarios
  - Gestión de equipos y jugadores
  - Gestión de partidos y torneos
  - Gestión de venues y árbitros
  - Configuración del sistema

#### 📚 Documentación API (Swagger)
- **URL:** http://localhost:8000/swagger/
- **Descripción:** Documentación interactiva de la API
- **Funcionalidades:**
  - Explorar todos los endpoints
  - Probar APIs directamente
  - Ver esquemas de datos

#### 🔗 API de Autenticación
- **URL:** http://localhost:8000/api/auth/login/
- **Método:** POST
- **Body:** `{"username": "admin", "password": "admin123"}`

## 🎯 Tokens JWT Generados

### 🔑 Access Token (válido por 1 hora)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyMTY3NzA2LCJpYXQiOjE3NTIxNjQxMDYsImp0aSI6ImNjZjQzMjc0ZmYxZjQ0OWJiMDE4Mzk1MzY3Yzg5YTQzIiwidXNlcl9pZCI6MX0.nAFTzz1wYKJjXWYvRxprdY-q1YFQFLxxoipThbGazNsc
```

### 🔄 Refresh Token (válido por 7 días)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1Mjc2ODkwNiwiaWF0IjoxNzUyMTY0MTA2LCJqdGkiOiJkYTc1MjdjYzE0NmI0ODU3OWRlYmJiZmZmZTY1NjEzMCIsInVzZXJfaWQiOjF9.C4i5552OaEd1Mm39KLBK_n0bK4CZfvDqyvVpXwaq4zg0
```

## 💻 Funciones Frontend Agregadas

### 🎮 Botones de Autenticación
En el componente Schedule se agregaron dos botones:

1. **🔑 Autenticar** - Token JWT temporal de desarrollo
2. **🔐 Login Admin** - Login automático como administrador

### 🔧 Funciones Disponibles
```typescript
// Login automático como admin
const result = await loginAsAdmin()

// Establecer token de superusuario
setSuperuserAuthToken()

// Verificar si es admin
const isUserAdmin = isAdmin()
```

## 📝 Instrucciones de Uso

### 1. Acceso al Panel Admin
1. Ir a http://localhost:8000/admin/
2. Ingresar usuario: `admin`
3. Ingresar contraseña: `admin123`
4. Acceder a todas las funcionalidades

### 2. Login en Frontend
1. Ir al calendario de partidos
2. Hacer clic en "🔐 Login Admin"
3. El sistema hará login automático
4. Ya puedes programar partidos con permisos de admin

### 3. Uso de API
```bash
# Obtener token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Usar token para acceder a recursos protegidos
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/matches/
```

## 🛡️ Permisos del Superusuario

### ✅ Permisos Incluidos
- **Gestión completa de usuarios**
- **CRUD completo de equipos y jugadores**
- **Gestión de partidos y torneos**
- **Configuración de venues y árbitros**
- **Acceso a estadísticas y reportes**
- **Gestión de la base de datos**
- **Acceso a logs y configuración**

### 🔒 Acciones Permitidas
- Crear, leer, actualizar y eliminar cualquier registro
- Acceder a endpoints protegidos de la API
- Modificar configuraciones del sistema
- Generar reportes administrativos
- Gestionar otros usuarios

## 🚀 Próximos Pasos

1. **Usar el admin para configurar datos iniciales**
2. **Crear más usuarios con diferentes roles**
3. **Configurar permisos específicos por módulo**
4. **Implementar dashboard administrativo personalizado**

---

## 📞 Soporte

Si necesitas regenerar el superusuario o sus tokens:
```bash
cd backend
python create_superuser.py
```

**Estado:** ✅ SUPERUSUARIO CONFIGURADO Y FUNCIONAL
**Fecha:** 10 de julio de 2025
