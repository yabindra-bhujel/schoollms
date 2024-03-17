# dev.py
from .base import *

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'testDatabase',
        'USER': 'yabindrabhujel',
        'PASSWORD': 'yabindra12',
        'HOST': '127.0.0.1',
        'PORT': '5432',
        
    }
}


ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
]