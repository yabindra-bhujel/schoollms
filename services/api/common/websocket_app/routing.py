from django.urls import re_path
from .consumers import UserConnectionConsumer


websocket_urlpatterns = [
    re_path(r'ws/(?P<user_id>\w+)/$', UserConnectionConsumer.as_asgi()),
]