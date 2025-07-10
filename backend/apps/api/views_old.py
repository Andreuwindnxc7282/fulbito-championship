from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q, F, Count, Sum, Avg
from django.contrib.auth.models import User

from apps.competition.models import Competition, Phase
from apps.clubs.models import Club, Player
from apps.matches.models import Match, MatchEvent
from apps.infrastructure.models import Venue
from apps.officials.models import Official
from apps.statistics.models import TeamStatistics

from .serializers import (
    UserSerializer, CompetitionSerializer, PhaseSerializer, ClubSerializer,
    PlayerSerializer, VenueSerializer, OfficialSerializer, MatchSerializer,
    MatchEventSerializer, TeamStatisticsSerializer, StandingsSerializer,
    ScheduleMatchSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de usuarios"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'date_joined']
    ordering = ['-date_joined']


class CompetitionViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de competiciones"""
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    filterset_fields = ['season']
    ordering_fields = ['name', 'start_date', 'season']
    ordering = ['-season']


class PhaseViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de fases"""
    queryset = Phase.objects.select_related('competition').all()
    serializer_class = PhaseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    filterset_fields = ['competition']
    ordering_fields = ['order', 'start_date']
    ordering = ['order']


class ClubViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de clubes"""
    queryset = Club.objects.prefetch_related('players').all()
    serializer_class = ClubSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'coach']
    filterset_fields = ['group']
    ordering_fields = ['name', 'founded_date']
    ordering = ['name']

    @action(detail=True, methods=['get'])
    def players(self, request, pk=None):
        """Obtener jugadores de un club específico"""
        club = self.get_object()
        players = club.players.all()
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Obtener estadísticas de un club"""
        club = self.get_object()
        stats = TeamStatistics.objects.filter(team=club)
        serializer = TeamStatisticsSerializer(stats, many=True)
        return Response(serializer.data)


class PlayerViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de jugadores"""
    queryset = Player.objects.select_related('club').all()
    serializer_class = PlayerSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    filterset_fields = ['club', 'position']
    ordering_fields = ['name', 'birth_date']
    ordering = ['name']


class VenueViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de instalaciones"""
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'address']
    ordering_fields = ['name', 'capacity']
    ordering = ['name']


class OfficialViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de oficiales/árbitros"""
    queryset = Official.objects.all()
    serializer_class = OfficialSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    filterset_fields = ['category']
    ordering_fields = ['name', 'category']
    ordering = ['name']


class MatchViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de partidos"""
    queryset = Match.objects.select_related(
        'home_team', 'away_team', 'venue', 'referee'
    ).prefetch_related('events__player__club').all()
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['home_team', 'away_team', 'status', 'venue']
    ordering_fields = ['datetime']
    ordering = ['-datetime']

    @action(detail=True, methods=['get'])
    def events(self, request, pk=None):
        """Obtener eventos de un partido específico"""
        match = self.get_object()
        events = match.events.all().order_by('minute')
        serializer = MatchEventSerializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def live(self, request):
        """Obtener partidos en vivo"""
        live_matches = self.queryset.filter(status='live')
        serializer = self.get_serializer(live_matches, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Obtener próximos partidos"""
        upcoming_matches = self.queryset.filter(status='scheduled').order_by('datetime')[:10]
        serializer = self.get_serializer(upcoming_matches, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Obtener partidos recientes"""
        recent_matches = self.queryset.filter(status='finished').order_by('-datetime')[:10]
        serializer = self.get_serializer(recent_matches, many=True)
        return Response(serializer.data)


class MatchEventViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de eventos de partido"""
    queryset = MatchEvent.objects.select_related('match', 'player__club').all()
    serializer_class = MatchEventSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['match', 'event_type', 'player']
    ordering_fields = ['minute']
    ordering = ['minute']


class TeamStatisticsViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de estadísticas de equipos"""
    queryset = TeamStatistics.objects.select_related('team', 'phase').all()
    serializer_class = TeamStatisticsSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['team', 'phase']
    ordering_fields = ['points', 'goal_difference', 'goals_for']
    ordering = ['-points', '-goal_difference', '-goals_for']


class DashboardStatsView(APIView):
    """Vista para obtener estadísticas generales para el dashboard"""
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Estadísticas generales
            total_teams = Club.objects.count()
            total_players = Player.objects.count()
            total_matches = Match.objects.count()
            matches_played = Match.objects.filter(status='finished').count()
            matches_scheduled = Match.objects.filter(status='scheduled').count()
            
            # Goles totales
            total_goals = MatchEvent.objects.filter(event_type='goal').count()
            
            # Próximos partidos
            upcoming_matches = Match.objects.filter(status='scheduled').order_by('datetime')[:5]
            upcoming_matches_data = []
            for match in upcoming_matches:
                upcoming_matches_data.append({
                    'id': match.id,
                    'home_team': match.home_team.name,
                    'away_team': match.away_team.name,
                    'datetime': match.datetime,
                    'venue': match.venue.name if match.venue else 'TBD'
                })
            
            # Partidos recientes
            recent_matches = Match.objects.filter(status='finished').order_by('-datetime')[:5]
            recent_matches_data = []
            for match in recent_matches:
                recent_matches_data.append({
                    'id': match.id,
                    'home_team': match.home_team.name,
                    'away_team': match.away_team.name,
                    'home_score': match.home_score,
                    'away_score': match.away_score,
                    'datetime': match.datetime,
                })
            
            return Response({
                'total_teams': total_teams,
                'total_players': total_players,
                'total_matches': total_matches,
                'matches_played': matches_played,
                'matches_scheduled': matches_scheduled,
                'total_goals': total_goals,
                'upcoming_matches': upcoming_matches_data,
                'recent_matches': recent_matches_data,
            })
        
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ENDPOINTS PÚBLICOS REQUERIDOS

@api_view(['GET'])
@permission_classes([AllowAny])
def public_standings(request, tournament_id):
    """
    Endpoint público: /api/public/standings/<tournament_id>/
    Devuelve la tabla de posiciones del torneo, ordenada por puntos y diferencia de goles
    """
    try:
        # Verificar que existe la competición
        competition = Competition.objects.get(id=tournament_id)
        
        # Obtener estadísticas ordenadas por puntos y diferencia de goles
        standings = TeamStatistics.objects.filter(
            phase__competition=competition
        ).select_related('team', 'phase').order_by(
            '-points', '-goal_difference', '-goals_for', 'team__name'
        )
        
        # Preparar datos con posiciones
        standings_data = []
        for index, stat in enumerate(standings, 1):
            standings_data.append({
                'position': index,
                'team_name': stat.team.name,
                'team_logo': stat.team.logo.url if stat.team.logo else None,
                'matches_played': stat.matches_played,
                'wins': stat.wins,
                'draws': stat.draws,
                'losses': stat.losses,
                'goals_for': stat.goals_for,
                'goals_against': stat.goals_against,
                'goal_difference': stat.goal_difference,
                'points': stat.points,
            })
        
        return Response({
            'tournament_id': tournament_id,
            'tournament_name': competition.name,
            'standings': standings_data,
            'total_teams': len(standings_data),
            'last_updated': standings.first().team.name if standings else None
        })
    
    except Competition.DoesNotExist:
        return Response(
            {'error': f'Competición con ID {tournament_id} no encontrada'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def public_schedule(request, stage_id):
    """
    Endpoint público: /api/public/schedule/<stage_id>/
    Muestra los partidos programados en la fase seleccionada, con sus eventos
    """
    try:
        # Verificar que existe la fase
        phase = Phase.objects.get(id=stage_id)
        
        # Obtener partidos de la fase
        matches = Match.objects.filter(
            home_team__group__phase=phase
        ).select_related(
            'home_team', 'away_team', 'venue', 'referee'
        ).prefetch_related('events__player__club').order_by('datetime')
        
        # Preparar datos de partidos
        matches_data = []
        for match in matches:
            events_data = []
            for event in match.events.all().order_by('minute'):
                events_data.append({
                    'minute': event.minute,
                    'event_type': event.event_type,
                    'player_name': event.player.name if event.player else None,
                    'team_name': event.player.club.name if event.player and event.player.club else None,
                    'description': event.description
                })
            
            matches_data.append({
                'id': match.id,
                'home_team_name': match.home_team.name,
                'away_team_name': match.away_team.name,
                'home_team_logo': match.home_team.logo.url if match.home_team.logo else None,
                'away_team_logo': match.away_team.logo.url if match.away_team.logo else None,
                'home_score': match.home_score,
                'away_score': match.away_score,
                'datetime': match.datetime,
                'venue_name': match.venue.name if match.venue else 'TBD',
                'referee_name': match.referee.name if match.referee else 'TBD',
                'status': match.status,
                'events': events_data
            })
        
        # Agrupar por estado
        matches_by_status = {
            'scheduled': [m for m in matches_data if matches.get(id=m['id']).status == 'scheduled'],
            'live': [m for m in matches_data if matches.get(id=m['id']).status == 'live'],
            'finished': [m for m in matches_data if matches.get(id=m['id']).status == 'finished']
        }
        
        return Response({
            'stage_id': stage_id,
            'stage_name': phase.name,
            'competition_name': phase.competition.name,
            'matches': matches_data,
            'matches_by_status': matches_by_status,
            'total_matches': len(matches_data)
        })
    
    except Phase.DoesNotExist:
        return Response(
            {'error': f'Fase con ID {stage_id} no encontrada'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
                    'home_score': match.home_score,
                    'away_score': match.away_score,
                    'datetime': match.datetime,
                    'venue': match.venue.name
                })
            
            # Máximos goleadores
            top_scorers = Player.objects.annotate(
                goals=Count('match_events', filter=models.Q(match_events__event_type='goal'))
            ).order_by('-goals')[:5]
            
            top_scorers_data = []
            for player in top_scorers:
                top_scorers_data.append({
                    'id': player.id,
                    'name': f"{player.first_name} {player.last_name}",
                    'team': player.team.name,
                    'goals': player.goals
                })
            
            # Torneos activos
            active_tournaments = Tournament.objects.filter(is_active=True).count()
            
            return Response({
                'total_teams': total_teams,
                'total_players': total_players,
                'total_matches': total_matches,
                'matches_played': matches_played,
                'matches_scheduled': matches_scheduled,
                'total_goals': total_goals,
                'avg_goals_per_match': round(total_goals / matches_played, 2) if matches_played > 0 else 0,
                'upcoming_matches': upcoming_matches_data,
                'recent_matches': recent_matches_data,
                'top_scorers': top_scorers_data,
                'active_tournaments': active_tournaments
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PlayerStatsView(APIView):
    """
    Vista para obtener estadísticas detalladas de un jugador
    """
    permission_classes = [AllowAny]
    
    def get(self, request, player_id):
        try:
            player = Player.objects.get(id=player_id)
            
            # Estadísticas básicas
            events = MatchEvent.objects.filter(player=player)
            goals = events.filter(event_type='goal').count()
            yellow_cards = events.filter(event_type='yellow_card').count()
            red_cards = events.filter(event_type='red_card').count()
            
            # Partidos jugados
            matches_played = events.values('match').distinct().count()
            
            # Goles por partido
            goals_per_match = round(goals / matches_played, 2) if matches_played > 0 else 0
            
            # Últimos eventos
            recent_events = events.order_by('-match__datetime')[:10]
            recent_events_data = []
            for event in recent_events:
                recent_events_data.append({
                    'match': f"{event.match.team_home.name} vs {event.match.team_away.name}",
                    'date': event.match.datetime,
                    'event_type': event.get_event_type_display(),
                    'minute': event.minute
                })
            
            return Response({
                'player': {
                    'id': player.id,
                    'name': f"{player.first_name} {player.last_name}",
                    'team': player.team.name,
                    'position': player.get_position_display(),
                    'jersey_number': player.jersey_number,
                    'age': player.age
                },
                'stats': {
                    'matches_played': matches_played,
                    'goals': goals,
                    'yellow_cards': yellow_cards,
                    'red_cards': red_cards,
                    'goals_per_match': goals_per_match
                },
                'recent_events': recent_events_data
            })
        except Player.DoesNotExist:
            return Response({'error': 'Jugador no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TeamStatsView(APIView):
    """
    Vista para obtener estadísticas detalladas de un equipo
    """
    permission_classes = [AllowAny]
    
    def get(self, request, team_id):
        try:
            team = Team.objects.get(id=team_id)
            
            # Estadísticas de partidos
            home_matches = Match.objects.filter(team_home=team, status='finished')
            away_matches = Match.objects.filter(team_away=team, status='finished')
            
            total_matches = home_matches.count() + away_matches.count()
            
            # Goles marcados y recibidos
            home_goals_for = sum(m.home_score or 0 for m in home_matches)
            away_goals_for = sum(m.away_score or 0 for m in away_matches)
            total_goals_for = home_goals_for + away_goals_for
            
            home_goals_against = sum(m.away_score or 0 for m in home_matches)
            away_goals_against = sum(m.home_score or 0 for m in away_matches)
            total_goals_against = home_goals_against + away_goals_against
            
            # Victorias, empates y derrotas
            home_wins = home_matches.filter(home_score__gt=models.F('away_score')).count()
            away_wins = away_matches.filter(away_score__gt=models.F('home_score')).count()
            total_wins = home_wins + away_wins
            
            home_draws = home_matches.filter(home_score=models.F('away_score')).count()
            away_draws = away_matches.filter(away_score=models.F('home_score')).count()
            total_draws = home_draws + away_draws
            
            home_losses = home_matches.filter(home_score__lt=models.F('away_score')).count()
            away_losses = away_matches.filter(away_score__lt=models.F('home_score')).count()
            total_losses = home_losses + away_losses
            
            # Jugadores del equipo
            players = Player.objects.filter(team=team, is_active=True)
            players_data = []
            for player in players:
                goals = MatchEvent.objects.filter(player=player, event_type='goal').count()
                players_data.append({
                    'id': player.id,
                    'name': f"{player.first_name} {player.last_name}",
                    'position': player.get_position_display(),
                    'jersey_number': player.jersey_number,
                    'goals': goals
                })
            
            # Próximos partidos
            upcoming_matches = Match.objects.filter(
                models.Q(team_home=team) | models.Q(team_away=team),
                status='scheduled'
            ).order_by('datetime')[:5]
            
            upcoming_matches_data = []
            for match in upcoming_matches:
                upcoming_matches_data.append({
                    'id': match.id,
                    'home_team': match.team_home.name,
                    'away_team': match.team_away.name,
                    'datetime': match.datetime,
                    'venue': match.venue.name,
                    'is_home': match.team_home == team
                })
            
            return Response({
                'team': {
                    'id': team.id,
                    'name': team.name,
                    'coach': team.coach_name,
                    'founded': team.founded,
                    'group': team.group.name if team.group else None
                },
                'stats': {
                    'total_matches': total_matches,
                    'wins': total_wins,
                    'draws': total_draws,
                    'losses': total_losses,
                    'goals_for': total_goals_for,
                    'goals_against': total_goals_against,
                    'goal_difference': total_goals_for - total_goals_against,
                    'points': (total_wins * 3) + total_draws,
                    'win_percentage': round((total_wins / total_matches) * 100, 2) if total_matches > 0 else 0
                },
                'players': players_data,
                'upcoming_matches': upcoming_matches_data
            })
        except Team.DoesNotExist:
            return Response({'error': 'Equipo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def tournament_summary(request, tournament_id):
    """
    Endpoint para obtener un resumen completo de un torneo
    """
    try:
        tournament = Tournament.objects.get(id=tournament_id)
        
        # Información básica del torneo
        tournament_data = {
            'id': tournament.id,
            'name': tournament.name,
            'season_year': tournament.season_year,
            'start_date': tournament.start_date,
            'end_date': tournament.end_date,
            'is_active': tournament.is_active
        }
        
        # Fases del torneo
        stages = Stage.objects.filter(tournament=tournament).order_by('order')
        stages_data = []
        for stage in stages:
            stages_data.append({
                'id': stage.id,
                'name': stage.name,
                'stage_type': stage.get_stage_type_display(),
                'order': stage.order,
                'is_completed': stage.is_completed,
                'groups_count': stage.groups.count(),
                'matches_count': stage.matches.count()
            })
        
        # Equipos participantes
        teams = Team.objects.filter(group__stage__tournament=tournament).distinct()
        teams_data = []
        for team in teams:
            teams_data.append({
                'id': team.id,
                'name': team.name,
                'group': team.group.name if team.group else None
            })
        
        # Estadísticas del torneo
        matches = Match.objects.filter(stage__tournament=tournament)
        matches_played = matches.filter(status='finished').count()
        matches_scheduled = matches.filter(status='scheduled').count()
        
        goals = MatchEvent.objects.filter(match__stage__tournament=tournament, event_type='goal').count()
        
        # Tabla de posiciones
        standings = Standing.objects.filter(tournament=tournament).order_by('-points', '-goals_for', 'goals_against')
        standings_data = []
        for standing in standings:
            standings_data.append({
                'team': standing.team.name,
                'played': standing.played,
                'won': standing.won,
                'drawn': standing.drawn,
                'lost': standing.lost,
                'goals_for': standing.goals_for,
                'goals_against': standing.goals_against,
                'goal_difference': standing.goal_difference,
                'points': standing.points
            })
        
        return Response({
            'tournament': tournament_data,
            'stages': stages_data,
            'teams': teams_data,
            'stats': {
                'total_matches': matches.count(),
                'matches_played': matches_played,
                'matches_scheduled': matches_scheduled,
                'total_goals': goals,
                'avg_goals_per_match': round(goals / matches_played, 2) if matches_played > 0 else 0
            },
            'standings': standings_data
        })
    except Tournament.DoesNotExist:
        return Response({'error': 'Torneo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
