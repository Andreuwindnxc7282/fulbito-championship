from django.contrib import admin
from .models import Tournament, Stage, Group

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ['name', 'season_year', 'start_date', 'end_date', 'is_active']
    list_filter = ['season_year', 'is_active', 'start_date']
    search_fields = ['name', 'description']
    date_hierarchy = 'start_date'
    ordering = ['-season_year', 'name']
    list_editable = ['is_active']
    actions = ['activate_tournaments', 'deactivate_tournaments']
    
    def activate_tournaments(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f'{queryset.count()} torneos activados.')
    activate_tournaments.short_description = "Activar torneos seleccionados"
    
    def deactivate_tournaments(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f'{queryset.count()} torneos desactivados.')
    deactivate_tournaments.short_description = "Desactivar torneos seleccionados"

@admin.register(Stage)
class StageAdmin(admin.ModelAdmin):
    list_display = ['name', 'tournament', 'stage_type', 'order', 'is_completed']
    list_filter = ['tournament', 'stage_type', 'is_completed']
    search_fields = ['name', 'tournament__name']
    ordering = ['tournament', 'order']
    list_editable = ['is_completed', 'order']
    actions = ['mark_completed', 'mark_not_completed']
    
    def mark_completed(self, request, queryset):
        queryset.update(is_completed=True)
        self.message_user(request, f'{queryset.count()} etapas marcadas como completadas.')
    mark_completed.short_description = "Marcar como completadas"
    
    def mark_not_completed(self, request, queryset):
        queryset.update(is_completed=False)
        self.message_user(request, f'{queryset.count()} etapas marcadas como no completadas.')
    mark_not_completed.short_description = "Marcar como no completadas"

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'stage', 'max_teams', 'current_teams']
    list_filter = ['stage__tournament', 'stage']
    search_fields = ['name', 'stage__name']
    ordering = ['stage', 'name']
    
    def current_teams(self, obj):
        return obj.teams.count()
    current_teams.short_description = 'Equipos Actuales'
