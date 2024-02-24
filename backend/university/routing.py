from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from django.core.asgi import get_asgi_application
import realtimeapi.routing
import student.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            realtimeapi.routing.websocket_urlpatterns,
            student.routing.websocket_urlpatterns,
        ])
    ),
})
