from django.urls import re_path
from .consumers import AIProgressConsumer

websocket_urlpatterns = [
    re_path(r'^ws/ai-progress/(?P<task_id>[^/]+)/$', AIProgressConsumer.as_asgi())
]