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
    queryset = Player.objects.select_related('team').all()
    serializer_class = PlayerSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    filterset_fields = ['team', 'position']
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
    ).prefetch_related('events__player__team').all()
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
    queryset = MatchEvent.objects.select_related('match', 'player__team').all()
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
        ).prefetch_related('events__player__team').order_by('datetime')
        
        # Preparar datos de partidos
        matches_data = []
        for match in matches:
            events_data = []
            for event in match.events.all().order_by('minute'):
                events_data.append({
                    'minute': event.minute,
                    'event_type': event.event_type,
                    'player_name': event.player.name if event.player else None,
                    'team_name': event.player.team.name if event.player and event.player.team else None,
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
        
        return Response({
            'stage_id': stage_id,
            'stage_name': phase.name,
            'competition_name': phase.competition.name,
            'matches': matches_data,
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
