from django.urls import path
from .views import  *

urlpatterns = [
    path('leave_group/<str:group_id>/', leaveGroup, name='leaveGroup'),
    path('add_group_image/', addGroupImage, name='add_group_image'),
    path('get_group_message_by_groupName/<str:group_id>/', get_group_message_by_groupName, name='get_group_message_by_groupName'),
    path('group_message/', save_group_message, name='save_group_message'),
    path('get_all_messagess/', all_messages, name="get_all_messages"),
    path('update_message_status/<str:sender>/<str:receriver>/', update_message_status, name='update_message_status'),
    path('get_group_list/<str:username>/', get_group_list, name='get_group_list'),
    path('getalluser/', get_all_user, name='get_all_user'),
    path('', save_message_to_database, name='save_message_to_database'),
    path('create_group/', create_group, name='create_group'),
    path('get_all_messages/<str:sender>/<str:receiver>/', get_all_messages, name='get_all_messages'),

    path('get_all_newsFeed/', get_all_newsFeed, name='get_all_newsFeed'),
    path('add_comment/', add_comment, name='add_comment'),
    path('get_Comment/<int:postID>/', get_Comment, name='get_Comment'),
    path('add_new_Post/', add_new_Post, name ="add_new_Post"),
    path('delete_post/<int:postid>/', delete_post, name='delete_post'),
    path('update_post/<int:postid>/', update_post, name='update_post'),

]
