"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import dotenv
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter


dotenv_file = os.path.join(".env")
if os.path.isfile(dotenv_file):
    dotenv.load_dotenv(dotenv_file)

isDev = os.environ.get('DEVELOPMENT_MODE') == 'True'

if isDev:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')

# Djangoの初期化
# django.setup()

django_asgi_app = get_asgi_application()

from common.socials.routing import websocket_urlpatterns
from common.websocket_app.routing import websocket_urlpatterns as base_connection_urlpatterns


application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': URLRouter([
        *websocket_urlpatterns,
        *base_connection_urlpatterns
    ]),
})
