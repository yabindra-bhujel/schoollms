from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from drf_spectacular.views import SpectacularAPIView,SpectacularSwaggerView
from rest_framework import routers
from accounts.views import *
from students.views import *
from teachers.views import *
import debug_toolbar

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='User')
router.register(r'profile', UserProfileViewSet, basename='UserProfile')
router.register(r'settings', ApplicationSettingsViewSet, basename='ApplicationSettings')
router.register(r'password', PasswordResetViewzSet, basename='PasswordResetViewzSet')
router.register(r'admin/students', AdminStudentViewSet, basename='Student')
router.register(r'students', StudentViewSet, basename='Student')
router.register(r'admin/teachers', AdminTeacherViewSet, basename='admin-teachers')
router.register(r'teachers', TeacherViewSet, basename='Teacher')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('courses.urls')),
    path('api/', include('common.urls')),

    path('api/', include(router.urls)),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('', SpectacularSwaggerView.as_view(url_name='schema')),

    path('api/login/', UserTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/logout/', BlacklistRefreshView.as_view(), name="logout"),
    path('api/token/', UserTokenObtainPairView.as_view(), name='token_obtain_pair'),


]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls))
        ]
