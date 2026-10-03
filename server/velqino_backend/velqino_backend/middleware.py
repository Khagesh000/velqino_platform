"""
Database Connection Cleanup Middleware
Ensures all database connections are closed at the end of each request,
preventing connection pool exhaustion on cloud databases with low connection limits (e.g. Clever Cloud max 5).
"""
from django.db import connections

class CloseDbConnectionsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            return self.get_response(request)
        finally:
            for conn in connections.all(initialized_only=True):
                try:
                    conn.close()
                except Exception:
                    pass
