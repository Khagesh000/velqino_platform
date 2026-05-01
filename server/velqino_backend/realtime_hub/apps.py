from django.apps import AppConfig

class RealtimeHubConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'realtime_hub'

    def ready(self):
        import realtime_hub.signals