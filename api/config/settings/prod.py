# prod.py
from .base import *

DEBUG=False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'lmsdatabase',   
        'USER': 'root',         
        'PASSWORD': 'root',      
        'HOST': 'db',     
        'PORT': '5432',         
    }
}


ALLOWED_HOSTS = [
    'localhost',
    'myapp.com',
    '0.0.0.0'
]