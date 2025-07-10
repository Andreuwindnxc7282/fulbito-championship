from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Club, Player
from .serializers import ClubSerializer, PlayerSerializer

class ClubViewSet(viewsets.ModelViewSet):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['group']
    search_fields = ['name', 'coach']
    ordering = ['name']

    @action(detail=True, methods=['get'])
    def players(self, request, pk=None):
        """Obtener jugadores del club"""
        club = self.get_object()
        players = club.players.all()
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Obtener estadísticas del equipo"""
        team = self.get_object()
        from apps.statistics.models import Standing
        
        standings = Standing.objects.filter(team=team)
        stats = []
        for standing in standings:
            stats.append({
                'tournament': standing.tournament.name,
                'played': standing.played,
                'won': standing.won,
                'drawn': standing.drawn,
                'lost': standing.lost,
                'goals_for': standing.goals_for,
                'goals_against': standing.goals_against,
                'goal_difference': standing.goal_difference,
                'points': standing.points
            })
        return Response(stats)

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.filter(is_active=True)
    serializer_class = PlayerSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['team', 'position', 'is_active']
    search_fields = ['first_name', 'last_name', 'team__name']
    ordering = ['team', 'jersey_number']

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Obtener estadísticas del jugador"""
        player = self.get_object()
        from apps.matches.models import MatchEvent
        
        events = MatchEvent.objects.filter(player=player)
        stats = {
            'goals': events.filter(event_type='goal').count(),
            'yellow_cards': events.filter(event_type='yellow_card').count(),
            'red_cards': events.filter(event_type='red_card').count(),
            'matches_played': events.values('match').distinct().count()
        }
        return Response(stats)
