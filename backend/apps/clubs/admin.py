from django.contrib import admin
from .models import Team, Player

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'coach_name', 'founded', 'group', 'total_players', 'is_active']
    list_filter = ['group', 'is_active', 'founded']
    search_fields = ['name', 'coach_name']
    ordering = ['name']
    list_editable = ['is_active']
    actions = ['make_active', 'make_inactive']
    
    def total_players(self, obj):
        return obj.total_players
    total_players.short_description = 'Total Jugadores'
    
    def make_active(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f'{queryset.count()} equipos activados.')
    make_active.short_description = "Activar equipos seleccionados"
    
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f'{queryset.count()} equipos desactivados.')
    make_inactive.short_description = "Desactivar equipos seleccionados"

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'team', 'position', 'jersey_number', 'age', 'is_active']
    list_filter = ['team', 'position', 'is_active']
    search_fields = ['first_name', 'last_name', 'team__name']
    ordering = ['team', 'jersey_number']
    list_editable = ['is_active', 'jersey_number']
    actions = ['make_active', 'make_inactive']
    
    def full_name(self, obj):
        return obj.full_name
    full_name.short_description = 'Nombre Completo'
    
    def age(self, obj):
        return obj.age
    age.short_description = 'Edad'
    
    def make_active(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f'{queryset.count()} jugadores activados.')
    make_active.short_description = "Activar jugadores seleccionados"
    
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f'{queryset.count()} jugadores desactivados.')
    make_inactive.short_description = "Desactivar jugadores seleccionados"
