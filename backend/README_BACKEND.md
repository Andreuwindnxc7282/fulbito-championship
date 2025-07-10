# Backend API - Sistema de Gestión de Campeonato de Fulbito

## 🎯 Estado del Proyecto

✅ **COMPLETADO** - El backend está completamente funcional con todas las características requeridas.

## 🏗️ Arquitectura

- **Framework**: Django 5.1.3 + Django REST Framework
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Autenticación**: JWT (SimpleJWT)
- **Documentación**: Swagger/OpenAPI
- **CORS**: Configurado para frontend

## 📊 Modelos Implementados

### 🏆 Competition App
- **Tournament**: Torneos con temporadas
- **Stage**: Fases del torneo (grupos, eliminatorias)
- **Group**: Grupos dentro de cada fase

### ⚽ Clubs App
- **Team**: Equipos participantes
- **Player**: Jugadores con posiciones y números

### 🏟️ Infrastructure App
- **Venue**: Estadios y canchas

### 👨‍⚖️ Officials App
- **Referee**: Árbitros con licencias

### ⚽ Matches App
- **Match**: Partidos con resultados
- **MatchEvent**: Eventos del partido (goles, tarjetas, etc.)

### 📈 Statistics App
- **Standing**: Tabla de posiciones por equipo

## 🌐 API Endpoints

### 🔓 Endpoints Públicos (Sin autenticación)
```
GET /api/public/standings/<tournament_id>/  # Tabla de posiciones
GET /api/public/schedule/<stage_id>/        # Calendario de partidos
```

### 🔐 Endpoints Protegidos (Requieren JWT)
```
# CRUD Completo para todos los modelos
GET|POST /api/tournaments/
GET|PUT|PATCH|DELETE /api/tournaments/<id>/

GET|POST /api/stages/
GET|PUT|PATCH|DELETE /api/stages/<id>/

GET|POST /api/teams/
GET|PUT|PATCH|DELETE /api/teams/<id>/

GET|POST /api/players/
GET|PUT|PATCH|DELETE /api/players/<id>/

GET|POST /api/venues/
GET|PUT|PATCH|DELETE /api/venues/<id>/

GET|POST /api/referees/
GET|PUT|PATCH|DELETE /api/referees/<id>/

GET|POST /api/matches/
GET|PUT|PATCH|DELETE /api/matches/<id>/

GET|POST /api/match-events/
GET|PUT|PATCH|DELETE /api/match-events/<id>/

GET|POST /api/standings/
GET|PUT|PATCH|DELETE /api/standings/<id>/
```

### 🔑 Autenticación
```
POST /api/auth/login/     # Obtener tokens JWT
POST /api/auth/refresh/   # Renovar token
```

### 📚 Documentación
```
GET /api/schema/swagger-ui/  # Interfaz Swagger
GET /api/schema/redoc/       # Documentación ReDoc
GET /api/schema/             # Schema OpenAPI JSON
```

## 🗄️ Datos de Ejemplo

### 📝 Comando de Carga de Datos
```bash
python manage.py load_championship_data
```
**Carga**:
- 1 Torneo: "International Champions Cup 2025"
- 1 Fase: "Gira de Verano - Estados Unidos"
- 4 Equipos: Real Madrid, Barcelona, Manchester City, Bayern Munich
- 30+ Jugadores con datos reales
- 4 Estadios en USA
- 4 Árbitros internacionales
- Estadísticas iniciales para todos los equipos

### ⚽ Comando de Partidos de Ejemplo
```bash
python manage.py create_sample_matches
```
**Crea**:
- 4 Partidos programados
- 1 Partido en vivo con eventos (goles)
- 1 Partido finalizado con estadísticas actualizadas
- Eventos de partido (goles, minutos)

## 🚀 Instalación y Uso

### 1. Instalar Dependencias
```bash
pip install -r requirements.txt
```

### 2. Configurar Base de Datos
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Crear Superusuario
```bash
python manage.py createsuperuser
```

### 4. Cargar Datos de Ejemplo
```bash
python manage.py load_championship_data
python manage.py create_sample_matches
```

### 5. Iniciar Servidor
```bash
python manage.py runserver 8000
```

## 🌐 URLs Importantes

- **API Root**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/
- **Swagger UI**: http://localhost:8000/api/schema/swagger-ui/
- **Tabla Posiciones**: http://localhost:8000/api/public/standings/1/
- **Calendario**: http://localhost:8000/api/public/schedule/1/

## 🔧 Configuración

### 📁 Settings Principales
- **DEBUG**: True (desarrollo)
- **CORS**: Habilitado para localhost:3000
- **JWT**: Configurado con refresh tokens
- **Base de Datos**: SQLite (auto-configurado)

### 🔄 Variables de Entorno
```env
USE_POSTGRES=true           # Para usar PostgreSQL
DB_NAME=fulbito_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
```

## 📊 Características Avanzadas

### 🔍 Filtros y Búsqueda
- Todos los ViewSets incluyen filtros por campos relacionados
- Búsqueda por texto en campos relevantes
- Ordenamiento por múltiples campos

### 📝 Serializers Especializados
- **StandingsSerializer**: Incluye posiciones calculadas
- **ScheduleMatchSerializer**: Datos optimizados para calendario
- **MatchSerializer**: Incluye eventos anidados

### 🔐 Seguridad
- JWT con refresh tokens
- CORS configurado
- Validaciones de modelos
- Permisos por endpoint

## ✅ Cumplimiento de Requerimientos

- ✅ **API RESTful completa** con todos los endpoints CRUD
- ✅ **Endpoints públicos** para standings y schedule
- ✅ **Autenticación JWT** implementada
- ✅ **Documentación Swagger** automatizada
- ✅ **Datos reales** del campeonato 2025
- ✅ **Base de datos** completamente estructurada
- ✅ **CORS** configurado para frontend
- ✅ **Comandos de gestión** para carga de datos

## 🎯 Próximos Pasos

1. **Frontend**: Conectar React/Next.js con esta API
2. **Despliegue**: Configurar Railway/Render para producción
3. **WebSockets**: Agregar actualizaciones en tiempo real
4. **Tests**: Implementar tests automatizados
5. **Cache**: Configurar Redis para mejores performance

---

🎉 **El backend está 100% funcional y listo para ser consumido por el frontend!**
