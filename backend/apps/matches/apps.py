from django.apps import AppConfig

class MatchesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.matches'
    
    def ready(self):
        import apps.matches.signals
