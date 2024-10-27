# dev.py
from .base import *


DEBUG = True

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
]

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}


DEBUG_TOOLBAR_PANELS = [
    'debug_toolbar.panels.versions.VersionsPanel',
    'debug_toolbar.panels.timer.TimerPanel',
    'debug_toolbar.panels.settings.SettingsPanel',
    'debug_toolbar.panels.headers.HeadersPanel',
    'debug_toolbar.panels.request.RequestPanel',
    'debug_toolbar.panels.sql.SQLPanel',
    'debug_toolbar.panels.staticfiles.StaticFilesPanel',
    'debug_toolbar.panels.templates.TemplatesPanel',
    'debug_toolbar.panels.cache.CachePanel',
    'debug_toolbar.panels.signals.SignalsPanel',
    'debug_toolbar.panels.logging.LoggingPanel',
    'debug_toolbar.panels.redirects.RedirectsPanel',
    'debug_toolbar.panels.profiling.ProfilingPanel',
]

if DEBUG:
    MIDDLEWARE += (
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    )
    INSTALLED_APPS += (
        'drf_spectacular',
        'debug_toolbar',
    )
    INTERNAL_IPS = ('127.0.0.1',)
    DEBUG_TOOLBAR_CONFIG = {
        'INTERCEPT_REDIRECTS': False,
    }

DEBUG_TOOLBAR_CONFIG = {
   "SHOW_TOOLBAR_CALLBACK" : lambda request: True,
}

REST_FRAMEWORK = {'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema'}

SPECTACULAR_SETTINGS = {
    "TITLE": "LMS Shikoku University",
    "DESCRIPTION": "API for LMS Shikoku University",
    "VERSION": "1.0.0",
    "SECURITY": [
        {
          "BearAuth": []
        },
    ],
    "SECURITY_SCHEMA": {
        "BearAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
}

LOG_DIR = 'var/log/api/dev/'
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)
# development logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'var/log/api/dev/dev.log',
            'formatter': 'verbose',
            
        },
        'file_db': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'var/log/api/dev/db.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        '': {
            'level': 'DEBUG',
            'handlers': ['file', 'console'],
            'propagate': True,
        },
        'django.db.backends': {
            'level': 'DEBUG',
            'handlers': ['file_db'],
            'propagate': False,
        }
    },
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(name)s - %(module)s.py (line %(lineno)d) %(process)d %(thread)d %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
            },

        "simple": {
            "format": "%(asctime)s: %(levelname)s %(message)s"
        }
    }
}