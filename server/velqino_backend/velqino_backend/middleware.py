"""
Database Connection Optimization Middleware
Allows keeping persistent connections open (standard for AWS RDS, Railway, Render, local dev)
while optionally closing connections after each request only if explicitly requested
via CLOSE_DB_CONNECTIONS_EACH_REQUEST=True (for low-connection free tiers like Clever Cloud max 5).
"""
from django.db import connections, close_old_connections
from django.conf import settings

class CloseDbConnectionsMiddleware:
    """
    Database Connection Optimization Middleware
    Proactively closes connections to ensure low-limit databases (such as
    Clever Cloud max_user_connections=5) never get saturated or raise
    OperationalError 1226.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Clean up any stale/dead connections before executing request
        close_old_connections()
        try:
            response = self.get_response(request)
            return response
        finally:
            # Guarantee all opened connections are closed immediately
            should_close = getattr(settings, 'CLOSE_DB_CONNECTIONS_EACH_REQUEST', True)
            if should_close or getattr(settings, 'DB_CONN_MAX_AGE', 0) == 0:
                for conn in connections.all(initialized_only=True):
                    try:
                        conn.close()
                    except Exception:
                        pass
            close_old_connections()
