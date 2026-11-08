"""
Database Connection Optimization Middleware
Allows keeping persistent connections open (standard for AWS RDS, Railway, Render, local dev)
while optionally closing connections after each request only if explicitly requested
via CLOSE_DB_CONNECTIONS_EACH_REQUEST=True (for low-connection free tiers like Clever Cloud max 5).
"""
from django.db import connections
from django.conf import settings

class CloseDbConnectionsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            return self.get_response(request)
        finally:
            if getattr(settings, 'CLOSE_DB_CONNECTIONS_EACH_REQUEST', False):
                for conn in connections.all(initialized_only=True):
                    try:
                        conn.close()
                    except Exception:
                        pass
