from django.contrib import admin
from .models import Standing

@admin.register(Standing)
class StandingAdmin(admin.ModelAdmin):
    list_display = ['team', 'tournament', 'played', 'won', 'drawn', 'lost', 'goal_difference', 'points']
    list_filter = ['tournament']
    search_fields = ['team__name', 'tournament__name']
    ordering = ['tournament', '-points', '-goals_for']
    readonly_fields = ['updated_at']
    
    actions = ['update_standings']
    
    def update_standings(self, request, queryset):
        """Acción para actualizar estadísticas manualmente"""
        for standing in queryset:
            standing.update_stats()
        self.message_user(request, f"Se actualizaron {queryset.count()} registros.")
    update_standings.short_description = "Actualizar estadísticas seleccionadas"
