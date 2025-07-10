#!/usr/bin/env python
"""
Script para verificar y configurar la base de datos con datos iniciales
"""
import os
import sys
import django
from django.db import transaction

# Configurar el entorno de Django
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fulbito.settings')
django.setup()

# Importar modelos
from apps.competition.models import Tournament, Stage, Group
from apps.clubs.models import Team
from apps.statistics.models import Standing
from django.contrib.auth.models import User
from datetime import date

def create_basic_data():
    """Crear datos básicos si no existen"""
    with transaction.atomic():
        # 1. Crear superusuario si no existe
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            print("✅ Superusuario creado: admin/admin123")
        
        # 2. Crear torneo si no existe
        tournament, created = Tournament.objects.get_or_create(
            name='International Champions Cup 2025',
            defaults={
                'season_year': 2025,
                'description': 'Torneo de pretemporada con los mejores clubes',
                'start_date': date(2025, 7, 1),
                'end_date': date(2025, 7, 31),
                'is_active': True
            }
        )
        if created:
            print("✅ Torneo creado")
        
        # 3. Crear stage si no existe
        stage, created = Stage.objects.get_or_create(
            tournament=tournament,
            name='Fase de Grupos',
            defaults={
                'stage_type': 'group',
                'order': 1,
                'start_date': tournament.start_date,
                'end_date': tournament.end_date,
                'is_completed': False
            }
        )
        if created:
            print("✅ Fase creada")
        
        # 4. Crear grupo si no existe
        group, created = Group.objects.get_or_create(
            stage=stage,
            name='Grupo A',
            defaults={'max_teams': 8}
        )
        if created:
            print("✅ Grupo creado")
        
        # 5. Crear equipos básicos si no existen
        teams_data = [
            {'name': 'Real Madrid', 'coach': 'Carlo Ancelotti', 'founded': 1902},
            {'name': 'Manchester City', 'coach': 'Pep Guardiola', 'founded': 1880},
            {'name': 'Arsenal', 'coach': 'Mikel Arteta', 'founded': 1886},
            {'name': 'Inter Miami', 'coach': 'Tata Martino', 'founded': 2018},
        ]
        
        teams_created = 0
        for team_data in teams_data:
            team, created = Team.objects.get_or_create(
                name=team_data['name'],
                defaults={
                    'coach_name': team_data['coach'],
                    'founded': team_data['founded'],
                    'description': f"Equipo fundado en {team_data['founded']}",
                    'group': group,
                    'is_active': True
                }
            )
            if created:
                teams_created += 1
                
                # Crear standing para cada equipo
                Standing.objects.get_or_create(
                    tournament=tournament,
                    team=team,
                    defaults={
                        'played': 0,
                        'won': 0,
                        'drawn': 0,
                        'lost': 0,
                        'goals_for': 0,
                        'goals_against': 0,
                        'goal_difference': 0,
                        'points': 0
                    }
                )
        
        print(f"✅ Equipos creados: {teams_created}")
        
        # Mostrar resumen
        print(f"\n📊 RESUMEN:")
        print(f"- Torneos: {Tournament.objects.count()}")
        print(f"- Equipos: {Team.objects.count()}")
        print(f"- Standings: {Standing.objects.count()}")

if __name__ == '__main__':
    print("🔧 Configurando base de datos...")
    try:
        create_basic_data()
        print("\n✅ Base de datos configurada correctamente")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
