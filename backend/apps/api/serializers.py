from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.competition.models import Tournament, Stage
from apps.clubs.models import Team, Player
from apps.matches.models import Match, MatchEvent
from apps.infrastructure.models import Venue
from apps.officials.models import Referee
from apps.statistics.models import Standing


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personalizado para login que incluye datos del usuario"""
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Agregar datos del usuario a la respuesta
        user_data = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        data['user'] = user_data
        
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'


class StageSerializer(serializers.ModelSerializer):
    tournament_name = serializers.CharField(source='tournament.name', read_only=True)
    
    class Meta:
        model = Stage
        fields = ['id', 'name', 'order', 'tournament', 'tournament_name', 'start_date', 'end_date']


class TeamSerializer(serializers.ModelSerializer):
    player_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'logo', 'coach_name', 'founded', 'group', 'player_count']
    
    def get_player_count(self, obj):
        return obj.players.count()


class PlayerSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    age = serializers.SerializerMethodField()
    
    class Meta:
        model = Player
        fields = ['id', 'first_name', 'last_name', 'birth_date', 'position', 'team', 'team_name', 'age']
    
    def get_age(self, obj):
        from datetime import date
        today = date.today()
        return today.year - obj.birth_date.year - ((today.month, today.day) < (obj.birth_date.month, obj.birth_date.day))


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'


class RefereeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Referee
        fields = '__all__'
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class MatchEventSerializer(serializers.ModelSerializer):
    player_name = serializers.SerializerMethodField()
    team_name = serializers.CharField(source='player.team.name', read_only=True)
    
    class Meta:
        model = MatchEvent
        fields = ['id', 'match', 'minute', 'event_type', 'player', 'player_name', 'team_name', 'description']
    
    def get_player_name(self, obj):
        if obj.player:
            return f"{obj.player.first_name} {obj.player.last_name}"
        return None


class MatchSerializer(serializers.ModelSerializer):
    home_team_name = serializers.CharField(source='team_home.name', read_only=True)
    away_team_name = serializers.CharField(source='team_away.name', read_only=True)
    venue_name = serializers.CharField(source='venue.name', read_only=True)
    referee_name = serializers.SerializerMethodField()
    events = MatchEventSerializer(many=True, read_only=True)
    
    class Meta:
        model = Match
        fields = [
            'id', 'team_home', 'team_away', 'home_team_name', 'away_team_name',
            'home_score', 'away_score', 'datetime', 'venue', 'venue_name',
            'referee', 'referee_name', 'status', 'events'
        ]
    
    def get_referee_name(self, obj):
        if obj.referee:
            return f"{obj.referee.first_name} {obj.referee.last_name}"
        return None


class StandingSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    team_logo = serializers.ImageField(source='team.logo', read_only=True)
    
    class Meta:
        model = Standing
        fields = [
            'id', 'team', 'team_name', 'team_logo', 'tournament',
            'played', 'won', 'drawn', 'lost',
            'goals_for', 'goals_against', 'goal_difference', 'points'
        ]


class StandingsSerializer(serializers.ModelSerializer):
    """Serializer especializado para tabla de posiciones"""
    team_name = serializers.CharField(source='team.name', read_only=True)
    team_logo = serializers.ImageField(source='team.logo', read_only=True)
    position = serializers.SerializerMethodField()
    
    class Meta:
        model = Standing
        fields = [
            'position', 'team_name', 'team_logo', 'played',
            'won', 'drawn', 'lost', 'goals_for', 'goals_against',
            'goal_difference', 'points'
        ]
    
    def get_position(self, obj):
        # La posición se calculará en la vista
        return getattr(obj, 'position', None)


class ScheduleMatchSerializer(serializers.ModelSerializer):
    """Serializer especializado para el calendario de partidos"""
    home_team_name = serializers.CharField(source='team_home.name', read_only=True)
    away_team_name = serializers.CharField(source='team_away.name', read_only=True)
    home_team_logo = serializers.ImageField(source='team_home.logo', read_only=True)
    away_team_logo = serializers.ImageField(source='team_away.logo', read_only=True)
    venue_name = serializers.CharField(source='venue.name', read_only=True)
    referee_name = serializers.SerializerMethodField()
    events = MatchEventSerializer(many=True, read_only=True)
    
    class Meta:
        model = Match
        fields = [
            'id', 'home_team_name', 'away_team_name', 'home_team_logo', 'away_team_logo',
            'home_score', 'away_score', 'datetime', 'venue_name', 'referee_name',
            'status', 'events'
        ]
    
    def get_referee_name(self, obj):
        if obj.referee:
            return f"{obj.referee.first_name} {obj.referee.last_name}"
        return None


class MatchCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear partidos con nombres de venue y referee"""
    venue_name = serializers.CharField(write_only=True, required=False)
    referee_name = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Match
        fields = [
            'team_home', 'team_away', 'datetime', 'venue_name', 'referee_name', 'status'
        ]
    
    def create(self, validated_data):
        from apps.infrastructure.models import Venue
        from apps.officials.models import Referee
        
        # Extraer nombres de venue y referee
        venue_name = validated_data.pop('venue_name', None)
        referee_name = validated_data.pop('referee_name', None)
        
        # Obtener o crear venue
        venue = None
        if venue_name:
            venue, _ = Venue.objects.get_or_create(
                name=venue_name,
                defaults={
                    'capacity': 1000,
                    'address': f'Dirección de {venue_name}',
                    'city': 'Ciudad',
                    'field_type': 'artificial'
                }
            )
        
        # Obtener o crear referee
        referee = None
        if referee_name:
            # Dividir el nombre en first_name y last_name
            name_parts = referee_name.split()
            first_name = name_parts[0] if name_parts else ''
            last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
            
            referee, _ = Referee.objects.get_or_create(
                first_name=first_name,
                last_name=last_name,
                defaults={
                    'license_number': f'LIC-{first_name[:2]}{last_name[:2]}123',
                    'phone': '123456789',
                    'email': f'{first_name.lower()}.{last_name.lower()}@referee.com',
                    'category': 'regional'
                }
            )
        
        # Obtener stage por defecto (primera etapa disponible)
        from apps.competition.models import Stage
        stage = Stage.objects.first()
        if not stage:
            raise serializers.ValidationError("No hay etapas disponibles para el partido")
        
        # Crear el partido
        match = Match.objects.create(
            venue=venue,
            referee=referee,
            stage=stage,
            **validated_data
        )
        
        return match
