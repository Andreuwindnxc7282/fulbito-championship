from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Tournament, Stage, Group
from .serializers import TournamentSerializer, StageSerializer, GroupSerializer

class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['season_year', 'is_active']
    search_fields = ['name', 'description']
    ordering = ['-season_year', 'name']

    @action(detail=True, methods=['get'])
    def standings(self, request, pk=None):
        """Obtener tabla de posiciones del torneo"""
        tournament = self.get_object()
        from apps.statistics.models import Standing
        from apps.statistics.serializers import StandingSerializer
        
        standings = Standing.objects.filter(tournament=tournament).order_by(
            '-points', '-goals_for', 'goals_against'
        )
        serializer = StandingSerializer(standings, many=True)
        return Response(serializer.data)

class StageViewSet(viewsets.ModelViewSet):
    queryset = Stage.objects.all()
    serializer_class = StageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tournament', 'stage_type', 'is_completed']
    search_fields = ['name']
    ordering = ['tournament', 'order']

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['stage', 'stage__tournament']
    search_fields = ['name']
    ordering = ['stage', 'name']
