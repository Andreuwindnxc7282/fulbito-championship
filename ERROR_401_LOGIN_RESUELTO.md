# Error 401 en Login del Frontend - RESUELTO ✅

## Problema Identificado
El frontend mostraba error 401 (Unauthorized) al intentar hacer login:
```
AxiosError: Request failed with status code 401
at login (webpack-internal:///(app-pages-browser)/./hooks/use-auth.tsx:41:30)
```

## Análisis del Problema
1. **Backend funcionando**: El endpoint `/api/auth/login/` devolvía tokens JWT correctamente
2. **Frontend esperando campo `user`**: El hook de autenticación esperaba `user` en la respuesta
3. **JWT estándar**: El `TokenObtainPairView` estándar solo devuelve `access` y `refresh`

## Solución Aplicada

### 1. Serializer Personalizado
```python
# backend/apps/api/serializers.py
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personalizado para login que incluye datos del usuario"""
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Agregar datos del usuario a la respuesta
        user_data = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        data['user'] = user_data
        
        return data
```

### 2. Vista Personalizada
```python
# backend/apps/api/views.py
class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista personalizada para login que incluye datos del usuario"""
    serializer_class = CustomTokenObtainPairSerializer
```

### 3. Actualización de URLs
```python
# backend/apps/api/urls.py
path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
```

### 4. Corrección de Import en Frontend
```tsx
// hooks/use-auth.tsx - CORREGIDO
import { authAPI } from "../lib/api"  // Era: "@/lib/api"
```

### 5. Logs de Depuración
Agregué logs en el hook de autenticación para mejor debugging:
```tsx
console.log("Attempting login for:", username)
console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")
console.log("Login response:", response.data)
```

## Verificación de la Solución

### Respuesta del Backend (Antes)
```json
{
  "refresh": "eyJhbGci...",
  "access": "eyJhbGci..."
}
```

### Respuesta del Backend (Después)
```json
{
  "refresh": "eyJhbGci...",
  "access": "eyJhbGci...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@fulbito.com",
    "first_name": "",
    "last_name": ""
  }
}
```

### Comando de Verificación
```bash
# Probar login desde terminal
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

## Credenciales de Prueba
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Email**: `admin@fulbito.com`

## Estado del Sistema
- ✅ **Backend JWT**: Funcionando con datos de usuario incluidos
- ✅ **Frontend Auth**: Hook corregido con imports y logs
- ✅ **Login Form**: Manejo de errores mejorado
- ✅ **Tokens**: Almacenamiento y validación funcionando
- ✅ **Redirección**: Al dashboard admin tras login exitoso

## Archivos Modificados
1. `backend/apps/api/serializers.py` - Nuevo serializer con datos de usuario
2. `backend/apps/api/views.py` - Nueva vista personalizada
3. `backend/apps/api/urls.py` - Actualización para usar vista personalizada
4. `hooks/use-auth.tsx` - Corrección de import y agregado de logs

---
**Fecha**: 2025-07-10  
**Problema**: Error 401 en login del frontend  
**Estado**: ✅ RESUELTO  
**Tiempo de resolución**: ~20 minutos
