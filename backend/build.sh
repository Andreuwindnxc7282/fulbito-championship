#!/usr/bin/env bash
# build.sh - Script de construcción para Render

set -o errexit  # exit on error

echo "🚀 Iniciando build para Render..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
pip install -r requirements.txt

# Agregar dj-database-url si no está
pip install dj-database-url

# Recolectar archivos estáticos
echo "📁 Recolectando archivos estáticos..."
python manage.py collectstatic --no-input

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
python manage.py migrate

# Crear superusuario si no existe
echo "👤 Verificando superusuario..."
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@fulbito.com', 'admin123')
    print('Superusuario creado')
else:
    print('Superusuario ya existe')
"

# Cargar datos iniciales si existen
echo "📊 Cargando datos iniciales..."
python manage.py shell -c "
import os
import django
from apps.clubs.models import Team, Player
from apps.competition.models import Tournament
from apps.matches.models import Match

# Si no hay datos, cargar algunos básicos
if not Team.objects.exists():
    # Crear torneo
    tournament = Tournament.objects.create(
        name='Fulbito Championship 2025',
        season_year=2025,
        description='Campeonato de Fulbito 2025'
    )
    
    # Crear equipos básicos
    teams = [
        'Real Madrid', 'Barcelona', 'Manchester City', 
        'Arsenal', 'Inter Miami'
    ]
    
    for team_name in teams:
        Team.objects.create(
            name=team_name,
            coach_name=f'Coach {team_name}',
            founded=2020
        )
    
    print('Datos básicos cargados')
else:
    print('Datos ya existen')
"

echo "✅ Build completado exitosamente!"
