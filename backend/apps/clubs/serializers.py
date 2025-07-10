from rest_framework import serializers
from .models import Club, Player

class PlayerSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    age = serializers.IntegerField(read_only=True)
    club_name = serializers.CharField(source='club.name', read_only=True)

    class Meta:
        model = Player
        fields = '__all__'

class ClubSerializer(serializers.ModelSerializer):
    total_players = serializers.IntegerField(read_only=True)
    players = PlayerSerializer(many=True, read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)

    class Meta:
        model = Club
        fields = '__all__'
