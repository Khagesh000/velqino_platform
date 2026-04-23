from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """Allow access only to admin users"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsSupport(BasePermission):
    """Allow access only to support staff"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'support'


class IsAdminOrSupport(BasePermission):
    """Allow access to admin or support staff"""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'support']