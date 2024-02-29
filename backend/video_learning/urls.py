from django.urls import path
from.views import *

urlpatterns = [
    path('', get_all_videos, name='video_learning'),
    path('<int:id>/', video_details, name='video_details'),
    path('addcomment/', create_comment, name='addcomment'),
    path('addlike/', create_like, name='addlike'),
    path('addvideo/', create_video, name='addvideo'),
     path('search/', search_video_data, name='search'),

    path('create_article/<str:username>/', create_article, name='create_article'),
    path('get_article_list/', get_article_list, name='get_article_list'),
    path('get_article_by_id/<int:id>/', get_article_by_id, name='get_article_by_id'),
]
