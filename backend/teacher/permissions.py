from rest_framework import permissions

class IsTeacherPermission(permissions.BasePermission):
  
    def has_permission(self, request, view):
        if request.user.is_teacher:
            return True
        return False
