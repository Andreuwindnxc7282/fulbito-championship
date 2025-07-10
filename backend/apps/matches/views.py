from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Match, MatchEvent
from .serializers import MatchSerializer, MatchEventSerializer, PublicStandingsSerializer, PublicScheduleSerializer
from apps.statistics.models import Standing

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'stage', 'team_home', 'team_away']
    search_fields = ['team_home__name', 'team_away__name']
    ordering_fields = ['datetime', 'created_at']
    ordering = ['-datetime']

    @action(detail=True, methods=['post'])
    def start_match(self, request, pk=None):
        """Iniciar un partido"""
        match = self.get_object()
        if match.status == 'scheduled':
            match.status = 'live'
            match.save()
            return Response({'status': 'Partido iniciado'})
        return Response(
            {'error': 'El partido no puede ser iniciado'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['post'])
    def finish_match(self, request, pk=None):
        """Finalizar un partido y actualizar estadísticas"""
        match = self.get_object()
        if match.status == 'live':
            match.status = 'finished'
            match.save()
            
            # Actualizar estadísticas
            self._update_standings(match)
            
            return Response({'status': 'Partido finalizado'})
        return Response(
            {'error': 'El partido no puede ser finalizado'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    def _update_standings(self, match):
        """Actualizar tabla de posiciones después de un partido"""
        tournament = match.stage.tournament
        
        # Obtener o crear standings para ambos equipos
        home_standing, _ = Standing.objects.get_or_create(
            team=match.team_home,
            tournament=tournament
        )
        away_standing, _ = Standing.objects.get_or_create(
            team=match.team_away,
            tournament=tournament
        )
        
        # Actualizar estadísticas
        home_standing.update_stats()
        away_standing.update_stats()

class MatchEventViewSet(viewsets.ModelViewSet):
    queryset = MatchEvent.objects.all()
    serializer_class = MatchEventSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['match', 'event_type', 'player']
    ordering = ['match', 'minute']

class PublicStandingsView(APIView):
    """Endpoint público para tabla de posiciones"""
    permission_classes = [AllowAny]

    def get(self, request, tournament_id):
        try:
            standings = Standing.objects.filter(
                tournament_id=tournament_id
            ).select_related('team', 'tournament').order_by(
                '-points', '-goals_for', 'goals_against'
            )
            
            serializer = PublicStandingsSerializer(standings, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class PublicScheduleView(APIView):
    """Endpoint público para calendario de partidos"""
    permission_classes = [AllowAny]

    def get(self, request, stage_id):
        try:
            matches = Match.objects.filter(
                stage_id=stage_id
            ).select_related(
                'team_home', 'team_away', 'venue', 'referee', 'stage'
            ).prefetch_related('events').order_by('datetime')
            
            serializer = PublicScheduleSerializer(matches, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
