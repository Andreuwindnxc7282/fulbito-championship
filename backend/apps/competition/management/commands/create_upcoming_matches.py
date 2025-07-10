from django.core.management.base import BaseCommand
from apps.matches.models import Match
from apps.clubs.models import Team
from apps.infrastructure.models import Venue
from apps.competition.models import Stage
from datetime import datetime, timedelta
import pytz

class Command(BaseCommand):
    help = 'Crea partidos próximos para el dashboard'

    def handle(self, *args, **options):
        # Obtener datos necesarios
        teams = list(Team.objects.all())
        venue = Venue.objects.first()
        stage = Stage.objects.first()
        
        if len(teams) < 4:
            self.stdout.write(self.style.ERROR('Se necesitan al menos 4 equipos'))
            return
            
        if not venue:
            self.stdout.write(self.style.ERROR('Se necesita al menos un estadio'))
            return
            
        if not stage:
            self.stdout.write(self.style.ERROR('Se necesita al menos una etapa/fase'))
            return

        # Timezone
        timezone = pytz.timezone('America/New_York')
        now = datetime.now(timezone)
        
        # Eliminar partidos futuros existentes para evitar duplicados
        Match.objects.filter(datetime__gt=now, status='scheduled').delete()
        
        # Crear partidos próximos
        matches_to_create = [
            {
                'home': teams[0],  # Inter Miami
                'away': teams[1],  # Manchester City  
                'datetime': now + timedelta(hours=2),
                'description': 'Semifinal - Ida'
            },
            {
                'home': teams[2],  # Barcelona
                'away': teams[3],  # PSG
                'datetime': now + timedelta(hours=6),
                'description': 'Semifinal - Ida'
            },
            {
                'home': teams[1],  # Manchester City
                'away': teams[0],  # Inter Miami
                'datetime': now + timedelta(days=1, hours=2),
                'description': 'Semifinal - Vuelta'
            },
            {
                'home': teams[3],  # PSG
                'away': teams[2],  # Barcelona
                'datetime': now + timedelta(days=1, hours=6),
                'description': 'Semifinal - Vuelta'
            },
            {
                'home': teams[0],  # Inter Miami
                'away': teams[2],  # Barcelona
                'datetime': now + timedelta(days=3),
                'description': 'Final'
            }
        ]
        
        created_count = 0
        for match_data in matches_to_create:
            match = Match.objects.create(
                team_home=match_data['home'],
                team_away=match_data['away'],
                datetime=match_data['datetime'],
                venue=venue,
                stage=stage,
                status='scheduled'
            )
            created_count += 1
            self.stdout.write(
                f"✅ {match.team_home.name} vs {match.team_away.name} - "
                f"{match.datetime.strftime('%d/%m/%Y %H:%M')} ({match_data['description']})"
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'\n🎉 Se crearon {created_count} partidos próximos exitosamente!')
        )
