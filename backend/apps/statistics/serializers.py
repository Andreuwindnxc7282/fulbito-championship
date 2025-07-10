from rest_framework import serializers
from .models import Standing

class StandingSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    team_logo = serializers.ImageField(source='team.logo', read_only=True)
    tournament_name = serializers.CharField(source='tournament.name', read_only=True)
    goal_difference = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Standing
        fields = '__all__'
