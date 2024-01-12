# routing.py
from django.urls import re_path

from .consumers import ConnectionConsumer, FriendRequestConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/$', ConnectionConsumer.as_asgi()),
    re_path(r'ws/friend_request/$', FriendRequestConsumer.as_asgi()),
]

