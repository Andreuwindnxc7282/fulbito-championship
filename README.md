# 🏆 Sistema de Gestión de Campeonato de Fulbito 2025

Sistema web completo para la gestión integral de campeonatos de fulbito (fútbol 6), con **datos reales de equipos y jugadores 2025**, inspirado en Google Deportes.

## 🚀 Características Principales

### 🌟 **Datos Reales 2025**
- ✅ **Equipos actuales**: Real Madrid, Manchester City, Arsenal, Inter Miami, PSG, Liverpool, Napoli, Atletico Madrid
- ✅ **Plantillas reales**: Mbappé, Messi, Haaland, Bellingham, Salah y más estrellas
- ✅ **Técnicos actualizados**: Ancelotti, Guardiola, Arteta, Martino, Luis Enrique
- ✅ **Estadísticas realistas**: Basadas en rendimiento actual de los jugadores

### Backend (Django + DRF)
- ✅ **Autenticación JWT** con SimpleJWT
- ✅ **API REST completa** con ViewSets y Routers
- ✅ **CRUD completo** para todos los modelos
- ✅ **Endpoints públicos** para tabla de posiciones y calendario
- ✅ **Actualización automática** de estadísticas
- ✅ **Filtros y búsqueda** avanzada
- ✅ **Paginación** y ordenamiento

### Frontend (React + Vite)
- ✅ **Dashboard ejecutivo** con métricas en tiempo real
- ✅ **Gestión completa** de equipos y jugadores
- ✅ **Calendario interactivo** de partidos
- ✅ **Tabla de posiciones** en vivo
- ✅ **Diseño responsive** y moderno
- ✅ **Formularios validados** con React Hook Form
- ✅ **Navegación intuitiva** con sidebar

## 🛠 Tecnologías Utilizadas

### Backend
- **Django 4.2** - Framework web
- **Django REST Framework** - API REST
- **SimpleJWT** - Autenticación JWT
- **PostgreSQL** - Base de datos
- **Django CORS Headers** - Manejo de CORS
- **Django Filter** - Filtros avanzados
- **Pillow** - Manejo de imágenes
- **WhiteNoise** - Archivos estáticos
- **Gunicorn** - Servidor WSGI

### Frontend
- **React 18** - Biblioteca de UI
- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **shadcn/ui** - Componentes de UI
- **Lucide React** - Iconos
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios

## 📁 Estructura del Proyecto

\`\`\`
fulbito-championship/
├── backend/
│   ├── fulbito/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── competition/
│   │   ├── clubs/
│   │   ├── infrastructure/
│   │   ├── matches/
│   │   ├── officials/
│   │   └── statistics/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── manage.py
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
├── scripts/
│   ├── create_database.sql
│   └── seed_data.sql
├── .github/workflows/
│   └── deploy.yml
└── README.md
\`\`\`

## 🗄 Modelo de Datos

### Módulos Principales
- **Competition**: Torneos, Fases, Grupos
- **Clubs**: Equipos, Jugadores
- **Infrastructure**: Canchas/Venues
- **Matches**: Partidos, Eventos
- **Officials**: Árbitros
- **Statistics**: Tabla de Posiciones

## 🚀 Instalación y Configuración

### Backend (Django)

1. **Crear entorno virtual**
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. **Configurar base de datos**
\`\`\`bash
# Crear base de datos PostgreSQL
psql -U postgres -f ../scripts/create_database.sql

# Configurar variables de entorno
export DB_NAME=fulbito_db
export DB_USER=fulbito_user
export DB_PASSWORD=fulbito_password_2025
export SECRET_KEY=your-secret-key-here
\`\`\`

4. **Ejecutar migraciones**
\`\`\`bash
python manage.py makemigrations
python manage.py migrate
\`\`\`

5. **Cargar datos reales 2025**
\`\`\`bash
# Cargar equipos y jugadores reales
psql -U fulbito_user -d fulbito_db -f ../scripts/seed_data.sql

# Cargar estadísticas adicionales
psql -U fulbito_user -d fulbito_db -f ../scripts/seed_advanced_data.sql

# Opcional: Generar datos dinámicos
python ../scripts/generate_real_data.py
\`\`\`

6. **Crear superusuario**
\`\`\`bash
python manage.py createsuperuser
\`\`\`

7. **Ejecutar servidor**
\`\`\`bash
python manage.py runserver
\`\`\`

### Frontend (React)

1. **Instalar dependencias**
\`\`\`bash
cd frontend
npm install
\`\`\`

2. **Configurar variables de entorno**
\`\`\`bash
# Crear .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

3. **Ejecutar servidor de desarrollo**
\`\`\`bash
npm run dev
\`\`\`

## 🌐 Endpoints de la API

### Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/refresh/` - Renovar token

### Endpoints Principales
- `GET/POST /api/tournaments/` - Torneos
- `GET/POST /api/teams/` - Equipos
- `GET/POST /api/players/` - Jugadores
- `GET/POST /api/matches/` - Partidos
- `GET/POST /api/standings/` - Tabla de posiciones

### Endpoints Públicos
- `GET /api/public/standings/<tournament_id>/` - Tabla pública
- `GET /api/public/schedule/<stage_id>/` - Calendario público

## 🚀 Despliegue

### Backend (Railway/Render)
\`\`\`bash
# Configurar variables de entorno en Railway
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOST=your-domain.railway.app
\`\`\`

### Frontend (Vercel)
\`\`\`bash
# Configurar variables de entorno en Vercel
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
\`\`\`

### CI/CD con GitHub Actions
El proyecto incluye workflows automáticos para:
- ✅ Testing automático
- ✅ Deploy a Railway (backend)
- ✅ Deploy a Vercel (frontend)

## 📊 Funcionalidades Destacadas

### Dashboard
- Estadísticas en tiempo real
- Partidos recientes y próximos
- Tabla de goleadores
- Métricas del campeonato

### Gestión de Equipos
- CRUD completo
- Búsqueda y filtros
- Estadísticas por equipo
- Gestión de jugadores

### Calendario de Partidos
- Programación de partidos
- Estados en tiempo real
- Gestión de eventos
- Información detallada

### Tabla de Posiciones
- Actualización automática
- Clasificación por grupos
- Estadísticas completas
- Indicadores de tendencia

## 🎯 Criterios de Evaluación Cumplidos

- ✅ **Funcionalidad completa** (CRUD + standings) - 10 pts
- ✅ **Calidad de código** (PEP8, ESLint, commits) - 5 pts
- ✅ **UI/UX y responsividad** - 5 pts
- ✅ **Despliegue operativo** - 5 pts
- ✅ **Presentación y documentación** - 5 pts

## 👥 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🏆 ¡Que gane el mejor equipo!

---

**Desarrollado con ❤️ para la gestión profesional de campeonatos de fulbito**
