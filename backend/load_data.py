#!/usr/bin/env python
"""
Script para cargar datos del campeonato 2025
"""
import os
import sys
import django

# Agregar el directorio backend al path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fulbito.settings')
django.setup()

# Ahora importar los modelos
from django.core.management import call_command

if __name__ == '__main__':
    print("🏆 Cargando datos del campeonato 2025...")
    try:
        call_command('load_championship_data')
        print("✅ Datos cargados exitosamente")
    except Exception as e:
        print(f"❌ Error al cargar datos: {e}")
