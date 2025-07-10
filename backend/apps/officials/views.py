from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Referee
from .serializers import RefereeSerializer

class RefereeViewSet(viewsets.ModelViewSet):
    queryset = Referee.objects.filter(is_active=True)
    serializer_class = RefereeSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_active']
    search_fields = ['first_name', 'last_name', 'license_number']
    ordering = ['last_name', 'first_name']
