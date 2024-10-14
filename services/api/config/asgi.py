"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import dotenv

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter

dotenv_file = os.path.join(".env")
if os.path.isfile(dotenv_file):
    dotenv.load_dotenv(dotenv_file)

isDev = os.environ.get('DEVELOPMENT_MODE') == 'True'

if isDev:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')


application = ProtocolTypeRouter({
    'http': get_asgi_application(),
})