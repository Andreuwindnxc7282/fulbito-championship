from rest_framework import serializers
from .models import Venue

class VenueSerializer(serializers.ModelSerializer):
    total_matches = serializers.IntegerField(source='matches.count', read_only=True)
    
    class Meta:
        model = Venue
        fields = '__all__'
