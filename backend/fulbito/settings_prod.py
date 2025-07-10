from .settings import *
import os
import dj_database_url

# CONFIGURACIÓN DE PRODUCCIÓN
DEBUG = False
ALLOWED_HOSTS = ['*']

# Base de datos PostgreSQL para Render
if 'DATABASE_URL' in os.environ:
    DATABASES = {
        'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))
    }

# Configuración de archivos estáticos para Render
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# CORS para frontend desplegado
CORS_ALLOWED_ORIGINS = [
    "https://fulbito-championship.vercel.app",
    "https://fulbito-frontend.vercel.app", 
    "http://localhost:3000",
]

CORS_ALLOW_ALL_ORIGINS = True  # Para desarrollo, cambiar en producción

# Configuración de medios para producción
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Configuración de logging para producción
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'fulbito_prod.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

# JWT para producción (tokens más cortos)
SIMPLE_JWT.update({
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
})

# Configuración de seguridad para producción
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
