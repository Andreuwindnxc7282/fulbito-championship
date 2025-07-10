from django.contrib import admin
from .models import Match, MatchEvent

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'datetime', 'venue', 'status', 'result']
    list_filter = ['status', 'stage', 'venue', 'datetime']
    search_fields = ['team_home__name', 'team_away__name']
    date_hierarchy = 'datetime'
    ordering = ['-datetime']

@admin.register(MatchEvent)
class MatchEventAdmin(admin.ModelAdmin):
    list_display = ['match', 'player', 'event_type', 'minute']
    list_filter = ['event_type', 'match__status']
    search_fields = ['match__team_home__name', 'match__team_away__name', 'player__first_name', 'player__last_name']
    ordering = ['match', 'minute']
