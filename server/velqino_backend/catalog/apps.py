from django.apps import AppConfig

class CatalogConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'catalog'

    def ready(self):  # ✅ ADD THIS METHOD
        """Register signals when app is ready"""
        import catalog.signals  # ✅ ADD THIS LINE