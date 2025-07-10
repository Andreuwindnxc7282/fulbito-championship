#!/usr/bin/env python
"""
Script para iniciar el servidor Django con configuración automática
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

# Configurar el entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fulbito.settings')

def main():
    """Función principal"""
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    print("🔧 Aplicando migraciones...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    print("📊 Configurando datos iniciales...")
    # Las vistas ahora crean datos automáticamente cuando se accede a los endpoints
    
    print("🚀 Iniciando servidor...")
    print("🌐 Backend disponible en: http://localhost:8000")
    print("📋 Admin panel en: http://localhost:8000/admin")
    print("🛠️  API endpoints en: http://localhost:8000/api/")
    print("⏹️  Presiona Ctrl+C para detener")
    
    execute_from_command_line(['manage.py', 'runserver'])

if __name__ == '__main__':
    main()
