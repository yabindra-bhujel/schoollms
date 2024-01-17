from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from tenant.views import *
from rest_framework_simplejwt.views import TokenBlacklistView


urlpatterns = [
    path('admin/', admin.site.urls),

    


    # user api path
    path('api/logout/', BlacklistRefreshView.as_view(), name="logout"),
    path('api/token/', UserTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('api/create_new_user',create_new_user, name="create_new_user"),
    path('get_university_login_screen_info',get_university_login_screen_info, name="get_university_login_screen_info"),
    path('get_user_profile_pic/<str:username>/', get_user_profile_pic, name="get_user_profile_pic"),
    path('change_password', change_password, name="change_password"),
    path('get_user_list/<str:username>/', get_user_list, name="get_user_list"),






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
router = routers.DefaultRouter()
router.register(r'users', UserViewset, basename='users')
urlpatterns += router.urls