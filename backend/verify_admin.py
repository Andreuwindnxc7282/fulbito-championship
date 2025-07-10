#!/usr/bin/env python
"""
Script para verificar el estado del admin de Django
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fulbito.settings')
django.setup()

from django.contrib import admin
from django.contrib.auth.models import User
from django.apps import apps

def main():
    print("=" * 60)
    print("🔧 VERIFICACIÓN DEL ADMIN DE DJANGO")
    print("=" * 60)
    
    # Verificar superusuarios
    print("\n👥 SUPERUSUARIOS DISPONIBLES:")
    superusers = User.objects.filter(is_superuser=True)
    if superusers.exists():
        for user in superusers:
            print(f"  ✅ {user.username} - {user.email}")
            print(f"     🔑 Activo: {user.is_active} | Staff: {user.is_staff} | Super: {user.is_superuser}")
    else:
        print("  ❌ No hay superusuarios configurados")
    
    # Verificar modelos registrados
    print("\n📋 MODELOS REGISTRADOS EN ADMIN:")
    registered_models = admin.site._registry
    
    if registered_models:
        # Agrupar por app
        apps_dict = {}
        for model in registered_models.keys():
            app_label = model._meta.app_label
            if app_label not in apps_dict:
                apps_dict[app_label] = []
            apps_dict[app_label].append(model._meta.model_name.title())
        
        for app_name, models in apps_dict.items():
            print(f"  📁 {app_name.upper()}:")
            for model in models:
                print(f"    ✅ {model}")
    else:
        print("  ❌ No hay modelos registrados")
    
    # Verificar apps instaladas relevantes
    print("\n📦 APPS LOCALES INSTALADAS:")
    local_apps = [
        'apps.competition',
        'apps.clubs', 
        'apps.infrastructure',
        'apps.matches',
        'apps.officials',
        'apps.statistics',
    ]
    
    for app_name in local_apps:
        try:
            app_config = apps.get_app_config(app_name.split('.')[-1])
            print(f"  ✅ {app_name} - OK")
        except Exception as e:
            print(f"  ❌ {app_name} - ERROR: {e}")
    
    # Contar datos
    print("\n📊 DATOS EN LA BASE DE DATOS:")
    try:
        from apps.clubs.models import Team, Player
        from apps.matches.models import Match
        from apps.competition.models import Tournament
        
        print(f"  🏆 Torneos: {Tournament.objects.count()}")
        print(f"  ⚽ Equipos: {Team.objects.count()}")
        print(f"  👤 Jugadores: {Player.objects.count()}")
        print(f"  🥅 Partidos: {Match.objects.count()}")
        print(f"  👥 Usuarios: {User.objects.count()}")
    except Exception as e:
        print(f"  ❌ Error al contar datos: {e}")
    
    print("\n" + "=" * 60)
    print("🚀 ACCESO AL ADMIN:")
    print("📍 URL: http://localhost:8000/admin/")
    print("🔑 Usuario: admin")
    print("🔐 Contraseña: admin123")
    print("=" * 60)

if __name__ == '__main__':
    main()
