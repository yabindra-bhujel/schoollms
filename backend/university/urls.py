from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import TokenRefreshView
from tenant.views import *
from rest_framework_simplejwt.views import TokenBlacklistView
from django.contrib.auth.views import PasswordResetConfirmView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    # User API paths
    path('api/login/', UserTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/logout/', BlacklistRefreshView.as_view(), name="logout"),
    path('api/token/', UserTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),


    path('update_two_factor_auth', update_two_factor_auth, name='update_two_factor_auth'),

    path('havetwoFactorAuth', check_have_two_factor_auth, name='check_have_two_factor_auth'),
    path('reset_password', reset_password, name='reset_password'),
    path('conform_reset_password/<str:uuid>/<str:token>/', conform_reset_password, name='conform_reset_password'),

    path('student/', include("student.urls")),
    path('course/', include("courses.urls")),   
    path('teacher/', include("teacher.urls")),
    path('notification/', include('notification.urls')),
    path('video_learning/', include('video_learning.urls')),
    path('editer/', include('editer.urls')),
    path('realtimeapi/', include('realtimeapi.urls')),
    path('file_manager/', include('file_manager.urls')),
    path('exam/', include('exam.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
