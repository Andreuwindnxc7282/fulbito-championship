from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Standing
from .serializers import StandingSerializer

class StandingViewSet(viewsets.ModelViewSet):
    queryset = Standing.objects.all()
    serializer_class = StandingSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tournament', 'team']
    search_fields = ['team__name', 'tournament__name']
    ordering = ['-points', '-goals_for', 'goals_against']

    @action(detail=False, methods=['post'])
    def update_all(self, request):
        """Actualizar todas las estadísticas"""
        standings = Standing.objects.all()
        for standing in standings:
            standing.update_stats()
        return Response({'message': f'Se actualizaron {standings.count()} registros'})
