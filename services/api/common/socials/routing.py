from django.urls import re_path
from .consumers import GroupChatConsumer, PrivateChatConsumer


websocket_urlpatterns = [
    re_path(r'ws/group_chat/(?P<group_name>[\w-]+)/(?P<user_id>[\w-]+)/$', GroupChatConsumer.as_asgi()),
    re_path(r'ws/private_chat/(?P<user_id>[\w-]+)/(?P<other_user_id>[\w-]+)/$', PrivateChatConsumer.as_asgi()),
]
