from django.core.management.base import BaseCommand
from django.db import transaction
from datetime import datetime, timedelta
from apps.competition.models import Tournament, Stage
from apps.clubs.models import Team
from apps.infrastructure.models import Venue
from apps.officials.models import Referee
from apps.matches.models import Match, MatchEvent
from apps.statistics.models import Standing
import random


class Command(BaseCommand):
    help = 'Crea partidos de ejemplo para el campeonato'

    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                self.stdout.write('⚽ Creando partidos de ejemplo...')
                
                # Obtener datos necesarios
                tournament = Tournament.objects.first()
                stage = Stage.objects.first()
                teams = list(Team.objects.all())
                venues = list(Venue.objects.all())
                referees = list(Referee.objects.all())
                
                if not all([tournament, stage, teams, venues, referees]):
                    self.stdout.write(
                        self.style.ERROR('❌ Faltan datos básicos. Ejecuta load_championship_data primero.')
                    )
                    return
                
                matches_created = 0
                events_created = 0
                
                # Crear algunos partidos
                match_date = datetime.now() + timedelta(days=1)
                
                for i in range(4):  # 4 partidos
                    # Seleccionar equipos diferentes para cada partido
                    if len(teams) >= 2:
                        home_team = teams[i % len(teams)]
                        away_team = teams[(i + 1) % len(teams)]
                        
                        if home_team == away_team:
                            away_team = teams[(i + 2) % len(teams)]
                    
                    match = Match.objects.create(
                        datetime=match_date + timedelta(hours=i*3),
                        team_home=home_team,
                        team_away=away_team,
                        venue=random.choice(venues),
                        referee=random.choice(referees),
                        stage=stage,
                        status='scheduled'
                    )
                    matches_created += 1
                    
                    # Crear un partido "en vivo" con eventos
                    if i == 0:
                        match.status = 'live'
                        match.home_score = 2
                        match.away_score = 1
                        match.save()
                        
                        # Crear eventos del partido
                        home_players = list(home_team.players.all()[:3])
                        away_players = list(away_team.players.all()[:3])
                        
                        if home_players:
                            # Gol del equipo local
                            MatchEvent.objects.create(
                                match=match,
                                minute=23,
                                event_type='goal',
                                player=home_players[0],
                                description=f'Gol de {home_players[0].full_name}'
                            )
                            events_created += 1
                            
                            # Segundo gol del equipo local
                            MatchEvent.objects.create(
                                match=match,
                                minute=67,
                                event_type='goal',
                                player=home_players[1],
                                description=f'Gol de {home_players[1].full_name}'
                            )
                            events_created += 1
                        
                        if away_players:
                            # Gol del equipo visitante
                            MatchEvent.objects.create(
                                match=match,
                                minute=45,
                                event_type='goal',
                                player=away_players[0],
                                description=f'Gol de {away_players[0].full_name}'
                            )
                            events_created += 1
                    
                    # Crear un partido finalizado
                    elif i == 1:
                        match.status = 'finished'
                        match.home_score = 3
                        match.away_score = 0
                        match.datetime = datetime.now() - timedelta(days=2)
                        match.save()
                        
                        # Actualizar estadísticas
                        home_standing = Standing.objects.get(team=home_team, tournament=tournament)
                        away_standing = Standing.objects.get(team=away_team, tournament=tournament)
                        
                        # Estadísticas del equipo ganador
                        home_standing.played += 1
                        home_standing.won += 1
                        home_standing.goals_for += 3
                        home_standing.goals_against += 0
                        home_standing.points += 3
                        home_standing.save()
                        
                        # Estadísticas del equipo perdedor
                        away_standing.played += 1
                        away_standing.lost += 1
                        away_standing.goals_for += 0
                        away_standing.goals_against += 3
                        away_standing.save()
                
                self.stdout.write(f'✅ Partidos creados: {matches_created}')
                self.stdout.write(f'✅ Eventos creados: {events_created}')
                
                # Actualizar algunas estadísticas adicionales
                standings_updated = 0
                for team in teams[:2]:  # Solo para los primeros 2 equipos
                    standing = Standing.objects.get(team=team, tournament=tournament)
                    if standing.played == 0:  # Solo si no se han actualizado
                        standing.played = random.randint(1, 3)
                        standing.won = random.randint(0, standing.played)
                        standing.drawn = random.randint(0, standing.played - standing.won)
                        standing.lost = standing.played - standing.won - standing.drawn
                        standing.goals_for = random.randint(0, standing.played * 2)
                        standing.goals_against = random.randint(0, standing.played * 2)
                        standing.points = standing.won * 3 + standing.drawn
                        standing.save()
                        standings_updated += 1
                
                self.stdout.write(f'✅ Estadísticas actualizadas: {standings_updated}')
                self.stdout.write(self.style.SUCCESS('🎉 ¡Partidos de ejemplo creados exitosamente!'))
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error: {e}')
            )
