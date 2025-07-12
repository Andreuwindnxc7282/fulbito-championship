from django.contrib import admin
from .models import Match, MatchEvent

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'datetime', 'venue', 'status', 'result']
    list_filter = ['status', 'stage', 'venue', 'datetime']
    search_fields = ['team_home__name', 'team_away__name']
    date_hierarchy = 'datetime'
    ordering = ['-datetime']
    list_editable = ['status']
    actions = ['mark_as_played', 'mark_as_scheduled']
    
    def mark_as_played(self, request, queryset):
        queryset.update(status='PL')
        self.message_user(request, f'{queryset.count()} partidos marcados como jugados.')
    mark_as_played.short_description = "Marcar como jugados"
    
    def mark_as_scheduled(self, request, queryset):
        queryset.update(status='SC')
        self.message_user(request, f'{queryset.count()} partidos marcados como programados.')
    mark_as_scheduled.short_description = "Marcar como programados"

@admin.register(MatchEvent)
class MatchEventAdmin(admin.ModelAdmin):
    list_display = ['match', 'player', 'event_type', 'minute']
    list_filter = ['event_type', 'match__status']
    search_fields = ['match__team_home__name', 'match__team_away__name', 'player__first_name', 'player__last_name']
    ordering = ['match', 'minute']
    list_editable = ['minute']
