from django.core.management.base import BaseCommand
from django.db import transaction
import json
import os
from datetime import datetime, date
from apps.competition.models import Tournament, Stage, Group
from apps.clubs.models import Team, Player
from apps.infrastructure.models import Venue
from apps.officials.models import Referee
from apps.matches.models import Match, MatchEvent
from apps.statistics.models import Standing


class Command(BaseCommand):
    help = 'Carga datos reales del campeonato desde el archivo JSON'

    def handle(self, *args, **options):
        # Ruta al archivo JSON (subir hasta el directorio raíz del proyecto)
        current_dir = os.path.dirname(__file__)
        project_root = os.path.join(current_dir, '..', '..', '..', '..', '..')
        json_file = os.path.join(project_root, 'scripts', 'championship_data_2025.json')
        json_file = os.path.abspath(json_file)
        
        self.stdout.write(f'🔍 Buscando archivo en: {json_file}')
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            with transaction.atomic():
                self.stdout.write('🏆 Cargando datos del campeonato...')
                
                # 1. Crear el torneo
                tournament_data = data['tournament']
                tournament, created = Tournament.objects.get_or_create(
                    name=tournament_data['name'],
                    defaults={
                        'season_year': tournament_data['season'],
                        'description': tournament_data['description'],
                        'start_date': datetime.strptime(tournament_data['start_date'], '%Y-%m-%d').date(),
                        'end_date': datetime.strptime(tournament_data['end_date'], '%Y-%m-%d').date(),
                        'is_active': True
                    }
                )
                if created:
                    self.stdout.write(f'✅ Torneo creado: {tournament.name}')
                else:
                    self.stdout.write(f'ℹ️  Torneo ya existe: {tournament.name}')
                
                # 2. Crear fase/etapa
                stage, created = Stage.objects.get_or_create(
                    tournament=tournament,
                    name=tournament_data['current_phase'],
                    defaults={
                        'stage_type': 'group',
                        'order': 1,
                        'start_date': tournament.start_date,
                        'end_date': tournament.end_date,
                        'is_completed': False
                    }
                )
                if created:
                    self.stdout.write(f'✅ Fase creada: {stage.name}')
                
                # 3. Crear grupo
                group, created = Group.objects.get_or_create(
                    stage=stage,
                    name='Grupo A',
                    defaults={'max_teams': 8}
                )
                if created:
                    self.stdout.write(f'✅ Grupo creado: {group.name}')
                
                # 4. Crear equipos y jugadores
                teams_created = 0
                players_created = 0
                
                for team_name, team_data in data['teams'].items():
                    team, created = Team.objects.get_or_create(
                        name=team_name,
                        defaults={
                            'coach_name': team_data['coach'],
                            'founded': team_data['founded'],
                            'description': f"Equipo de {team_data.get('city', 'Unknown')}, {team_data.get('country', 'Unknown')}",
                            'group': group,
                            'is_active': True
                        }
                    )
                    if created:
                        teams_created += 1
                    
                    # Crear jugadores
                    for index, player_data in enumerate(team_data['players'], 1):
                        # Separar nombre y apellido
                        name_parts = player_data['name'].split(' ')
                        first_name = name_parts[0]
                        last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
                        
                        # Calcular fecha de nacimiento aproximada
                        current_year = date.today().year
                        birth_year = current_year - player_data['age']
                        birth_date = date(birth_year, 1, 1)
                        
                        # Usar el número del JSON o asignar uno automáticamente
                        jersey_number = player_data.get('number', index)
                        
                        player, created = Player.objects.get_or_create(
                            first_name=first_name,
                            last_name=last_name,
                            team=team,
                            jersey_number=jersey_number,
                            defaults={
                                'birth_date': birth_date,
                                'position': player_data['position'],
                                'is_active': True
                            }
                        )
                        if created:
                            players_created += 1
                
                self.stdout.write(f'✅ Equipos creados: {teams_created}')
                self.stdout.write(f'✅ Jugadores creados: {players_created}')
                
                # 5. Crear venues
                venues_data = [
                    {'name': 'Hard Rock Stadium', 'city': 'Miami', 'capacity': 65000},
                    {'name': 'MetLife Stadium', 'city': 'New York', 'capacity': 82500},
                    {'name': 'Rose Bowl', 'city': 'Los Angeles', 'capacity': 90000},
                    {'name': 'Soldier Field', 'city': 'Chicago', 'capacity': 61500},
                ]
                
                venues_created = 0
                for venue_data in venues_data:
                    venue, created = Venue.objects.get_or_create(
                        name=venue_data['name'],
                        defaults={
                            'address': f"{venue_data['city']}, USA",
                            'capacity': venue_data['capacity'],
                            'is_active': True
                        }
                    )
                    if created:
                        venues_created += 1
                
                self.stdout.write(f'✅ Estadios creados: {venues_created}')
                
                # 6. Crear árbitros
                referees_data = [
                    {'first_name': 'Anthony', 'last_name': 'Taylor', 'category': 'internacional'},
                    {'first_name': 'Bjorn', 'last_name': 'Kuipers', 'category': 'internacional'},
                    {'first_name': 'Felix', 'last_name': 'Brych', 'category': 'internacional'},
                    {'first_name': 'Danny', 'last_name': 'Makkelie', 'category': 'internacional'},
                ]
                
                referees_created = 0
                for ref_data in referees_data:
                    ref, created = Referee.objects.get_or_create(
                        first_name=ref_data['first_name'],
                        last_name=ref_data['last_name'],
                        defaults={
                            'category': ref_data['category'],
                            'license_number': f"FIFA{ref_data['first_name'][:2]}{ref_data['last_name'][:2]}2025",
                            'is_active': True
                        }
                    )
                    if created:
                        referees_created += 1
                
                self.stdout.write(f'✅ Árbitros creados: {referees_created}')
                
                # 7. Crear estadísticas para todos los equipos
                teams = Team.objects.filter(group=group)
                standings_created = 0
                for team in teams:
                    standing, created = Standing.objects.get_or_create(
                        team=team,
                        tournament=tournament,
                        defaults={
                            'played': 0,
                            'won': 0,
                            'drawn': 0,
                            'lost': 0,
                            'goals_for': 0,
                            'goals_against': 0,
                            'points': 0
                        }
                    )
                    if created:
                        standings_created += 1
                
                self.stdout.write(f'✅ Estadísticas creadas: {standings_created}')
                
                self.stdout.write(self.style.SUCCESS('🎉 ¡Datos cargados exitosamente!'))
                self.stdout.write(f'📊 Resumen:')
                self.stdout.write(f'   - Torneo: {tournament.name}')
                self.stdout.write(f'   - Equipos: {Team.objects.count()}')
                self.stdout.write(f'   - Jugadores: {Player.objects.count()}')
                self.stdout.write(f'   - Estadios: {Venue.objects.count()}')
                self.stdout.write(f'   - Árbitros: {Referee.objects.count()}')
                
        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR(f'❌ Archivo no encontrado: {json_file}')
            )
        except json.JSONDecodeError as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error al leer JSON: {e}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error inesperado: {e}')
            )
