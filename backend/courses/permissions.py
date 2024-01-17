from rest_framework import permissions

class IsStudentAadTeacherPermission(permissions.BasePermission):
  
    def has_permission(self, request, view):
        if request.user.is_teacher or request.user.is_student:
            return True
        return False
    