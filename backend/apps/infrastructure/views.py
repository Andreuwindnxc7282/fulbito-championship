from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Venue
from .serializers import VenueSerializer

class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.filter(is_active=True)
    serializer_class = VenueSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['city', 'field_type', 'has_lighting', 'is_active']
    search_fields = ['name', 'address', 'city']
    ordering = ['city', 'name']
