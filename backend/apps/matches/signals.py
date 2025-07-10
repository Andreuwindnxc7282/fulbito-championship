from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Match
from apps.statistics.models import Standing

@receiver(post_save, sender=Match)
def update_standings_on_match_finish(sender, instance, **kwargs):
    """Actualizar tabla de posiciones cuando un partido termina"""
    if instance.status == 'finished' and instance.home_score is not None and instance.away_score is not None:
        tournament = instance.stage.tournament
        
        # Obtener o crear standings para ambos equipos
        home_standing, _ = Standing.objects.get_or_create(
            team=instance.team_home,
            tournament=tournament
        )
        away_standing, _ = Standing.objects.get_or_create(
            team=instance.team_away,
            tournament=tournament
        )
        
        # Actualizar estadísticas
        home_standing.update_stats()
        away_standing.update_stats()
