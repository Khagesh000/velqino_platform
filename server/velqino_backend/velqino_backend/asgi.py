import os
from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import catalog.routing
from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'velqino_backend.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),

    "websocket": AuthMiddlewareStack(
        URLRouter(
            catalog.routing.websocket_urlpatterns
        )
    ),
})