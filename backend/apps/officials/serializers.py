from rest_framework import serializers
from .models import Referee

class RefereeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    total_matches = serializers.IntegerField(source='matches.count', read_only=True)
    
    class Meta:
        model = Referee
        fields = '__all__'
