from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import TokenRefreshView
from tenant.views import *
from rest_framework_simplejwt.views import TokenBlacklistView
from django.contrib.auth.views import PasswordResetConfirmView


urlpatterns = [
    path('api/get_user_profile/', getUserProfile, name='getUserProfile'),
    path('api/updateEmailNotification', updateEmailNotification, name='updateEmailNotification'),
    path('api/update_two_factor_auth', update_two_factor_auth, name='update_two_factor_auth'),
    path('api/admin/', admin.site.urls),
    path('api/reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),


    # User API paths
    path('api/login/', UserTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/logout/', BlacklistRefreshView.as_view(), name="logout"),
    path('api/token/', UserTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),


    path('api/havetwoFactorAuth', check_have_two_factor_auth, name='check_have_two_factor_auth'),

    path('api/haveEmailNotification', haveEmailNotification, name='haveEmailNotification'),

    
    path('api/get_user_list', get_user_list, name='get_user_list'),
    path('api/reset_password', reset_password, name='reset_password'),
    path('api/conform_reset_password/<str:uuid>/<str:token>/', conform_reset_password, name='conform_reset_password'),
    path('api/profile_detalis', profileDetails, name='profileDetails'),
    path('api/update_profile_picture', updateProfilePicture, name='updateProfile'),
    path('api/chnage_password', changePassword, name='changePassword'),
    path('api/update_user_info', upadteUserInfo, name='updateUserProfile'),
    

    path('api/student/', include("student.urls")),
    path('api/course/', include("courses.urls")),   
    path('api/teacher/', include("teacher.urls")),
    path('api/notification/', include('notification.urls')),
    path('api/video_learning/', include('video_learning.urls')),
    path('api/editer/', include('editer.urls')),
    path('api/realtimeapi/', include('realtimeapi.urls')),
    path('api/exam/', include('exam.urls')),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
