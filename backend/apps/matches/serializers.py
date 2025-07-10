from rest_framework import serializers
from .models import Match, MatchEvent
from apps.clubs.serializers import TeamSerializer
from apps.infrastructure.serializers import VenueSerializer
from apps.officials.serializers import RefereeSerializer
from apps.statistics.models import Standing

class MatchEventSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.full_name', read_only=True)
    team_name = serializers.CharField(source='player.team.name', read_only=True)

    class Meta:
        model = MatchEvent
        fields = '__all__'

class MatchSerializer(serializers.ModelSerializer):
    team_home_name = serializers.CharField(source='team_home.name', read_only=True)
    team_away_name = serializers.CharField(source='team_away.name', read_only=True)
    venue_name = serializers.CharField(source='venue.name', read_only=True)
    referee_name = serializers.CharField(source='referee.full_name', read_only=True)
    stage_name = serializers.CharField(source='stage.name', read_only=True)
    events = MatchEventSerializer(many=True, read_only=True)
    result = serializers.CharField(read_only=True)

    class Meta:
        model = Match
        fields = '__all__'

class PublicStandingsSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    team_logo = serializers.ImageField(source='team.logo', read_only=True)
    goal_difference = serializers.IntegerField(read_only=True)

    class Meta:
        model = Standing
        fields = [
            'team_name', 'team_logo', 'played', 'won', 'drawn', 'lost',
            'goals_for', 'goals_against', 'goal_difference', 'points'
        ]

class PublicScheduleSerializer(serializers.ModelSerializer):
    team_home = TeamSerializer(read_only=True)
    team_away = TeamSerializer(read_only=True)
    venue = VenueSerializer(read_only=True)
    referee = RefereeSerializer(read_only=True)
    events = MatchEventSerializer(many=True, read_only=True)

    class Meta:
        model = Match
        fields = [
            'id', 'datetime', 'team_home', 'team_away', 'venue', 'referee',
            'home_score', 'away_score', 'status', 'events'
        ]
