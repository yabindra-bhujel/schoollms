from django.urls import re_path
from . import consumers


websocket_urlpatterns = [
    re_path(r'ws/(?P<user_id>\w+)/$', consumers.UserConnectionConsumer.as_asgi()),
]