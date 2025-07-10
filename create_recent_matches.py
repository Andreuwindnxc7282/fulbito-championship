#!/usr/bin/env python3
"""
Script para crear partidos finalizados para mostrar en "Partidos Recientes"
"""
import os
import sys
import django
from datetime import datetime, timedelta

# Configurar Django
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.join(backend_dir, 'backend')
sys.path.append(project_dir)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fulbito.settings')

# Cambiar al directorio backend
os.chdir(project_dir)
django.setup()

from apps.matches.models import Match
from apps.clubs.models import Team
from apps.infrastructure.models import Venue
from apps.competition.models import Stage
from django.utils import timezone

def create_finished_matches():
    """Crear partidos finalizados para mostrar en partidos recientes"""
    
    # Obtener equipos y otros datos necesarios
    teams = list(Team.objects.all())
    stage = Stage.objects.first()
    venue = Venue.objects.first()
    
    if len(teams) < 4:
        print("❌ No hay suficientes equipos en la base de datos")
        return
    
    if not stage:
        print("❌ No hay stages en la base de datos")
        return
        
    if not venue:
        print("❌ No hay venues en la base de datos")
        return
    
    # Partidos recientes finalizados (últimos 3 días)
    finished_matches = [
        {
            'team_home': teams[0],  # Real Madrid
            'team_away': teams[1],  # Manchester City
            'home_score': 2,
            'away_score': 1,
            'datetime': timezone.now() - timedelta(days=3, hours=2),
            'status': 'finished'
        },
        {
            'team_home': teams[2],  # Arsenal
            'team_away': teams[3],  # Inter Miami
            'home_score': 3,
            'away_score': 1,
            'datetime': timezone.now() - timedelta(days=2, hours=5),
            'status': 'finished'
        },
        {
            'team_home': teams[1],  # Manchester City
            'team_away': teams[2],  # Arsenal
            'home_score': 1,
            'away_score': 2,
            'datetime': timezone.now() - timedelta(days=1, hours=3),
            'status': 'finished'
        }
    ]
    
    print("🏆 Creando partidos finalizados...")
    
    for i, match_data in enumerate(finished_matches, 1):
        try:
            match, created = Match.objects.get_or_create(
                team_home=match_data['team_home'],
                team_away=match_data['team_away'],
                datetime=match_data['datetime'],
                defaults={
                    'stage': stage,
                    'venue': venue,
                    'home_score': match_data['home_score'],
                    'away_score': match_data['away_score'],
                    'status': match_data['status']
                }
            )
            
            if created:
                print(f"  ✅ Partido {i}: {match_data['team_home'].name} {match_data['home_score']}-{match_data['away_score']} {match_data['team_away'].name}")
            else:
                # Actualizar si ya existe
                match.home_score = match_data['home_score']
                match.away_score = match_data['away_score']
                match.status = match_data['status']
                match.save()
                print(f"  🔄 Actualizado: {match_data['team_home'].name} {match_data['home_score']}-{match_data['away_score']} {match_data['team_away'].name}")
                
        except Exception as e:
            print(f"  ❌ Error creando partido {i}: {e}")
    
    print(f"\n✅ Proceso completado!")
    print(f"📊 Total de partidos finalizados: {Match.objects.filter(status='finished').count()}")
    print(f"🕐 Los partidos recientes ahora deberían aparecer en el dashboard")

if __name__ == '__main__':
    create_finished_matches()
