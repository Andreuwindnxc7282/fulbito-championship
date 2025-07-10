from django.contrib import admin
from .models import Tournament, Stage, Group

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ['name', 'season_year', 'start_date', 'end_date', 'is_active']
    list_filter = ['season_year', 'is_active', 'start_date']
    search_fields = ['name', 'description']
    date_hierarchy = 'start_date'
    ordering = ['-season_year', 'name']

@admin.register(Stage)
class StageAdmin(admin.ModelAdmin):
    list_display = ['name', 'tournament', 'stage_type', 'order', 'is_completed']
    list_filter = ['tournament', 'stage_type', 'is_completed']
    search_fields = ['name', 'tournament__name']
    ordering = ['tournament', 'order']

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'stage', 'max_teams', 'current_teams']
    list_filter = ['stage__tournament', 'stage']
    search_fields = ['name', 'stage__name']
    
    def current_teams(self, obj):
        return obj.teams.count()
    current_teams.short_description = 'Equipos Actuales'
