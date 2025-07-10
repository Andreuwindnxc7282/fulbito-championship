from rest_framework import serializers
from .models import Tournament, Stage, Group

class TournamentSerializer(serializers.ModelSerializer):
    total_stages = serializers.IntegerField(source='stages.count', read_only=True)
    
    class Meta:
        model = Tournament
        fields = '__all__'

class StageSerializer(serializers.ModelSerializer):
    tournament_name = serializers.CharField(source='tournament.name', read_only=True)
    total_groups = serializers.IntegerField(source='groups.count', read_only=True)
    total_matches = serializers.IntegerField(source='matches.count', read_only=True)
    
    class Meta:
        model = Stage
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    stage_name = serializers.CharField(source='stage.name', read_only=True)
    tournament_name = serializers.CharField(source='stage.tournament.name', read_only=True)
    current_teams = serializers.IntegerField(source='teams.count', read_only=True)
    
    class Meta:
        model = Group
        fields = '__all__'
