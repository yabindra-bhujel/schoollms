from rest_framework import permissions

class IsStudentPermission(permissions.BasePermission):
  
    def has_permission(self, request, view):
        if request.user.is_student:
            return True
        
        return False
    

    