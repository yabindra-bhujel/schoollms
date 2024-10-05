from rest_framework import routers
from django.urls import path, include

from .views import *
from .subjects.views import *
from .attendance.views import *


router = routers.DefaultRouter()

router.register(r'admin/subject', AdminSubjectViewSet, basename='AdminSubject')
router.register(r'admin/subject_registration', SubjectRegistrationViewSet, basename='Subject')
router.register(r"admin/departments", DepartmentViewSet, basename="Department")
router.register(r'subject/student', StudentSubjectViewSet, basename='StduentSubject')
router.register(r'subject/teacher', TeacherSubjectViewSet, basename='TeacherSubject')
router.register(r'assignments', AssigmentViewSet, basename='Assignment')
router.register(r'subject_materiales', CourseMaterialesViewSet, basename='CourseMateriales')
router.register(r'announcements', AnnouncementViewSet, basename='Announcement')
router.register(r'syllabus', SyllabusViewSet, basename='Syllabus')
router.register(r'submissions', SubmissionViewSet, basename='Submission')
router.register(r'attendance', AttendanceViewSet, basename='Attendance')

urlpatterns = [
    path('', include(router.urls)),
]
