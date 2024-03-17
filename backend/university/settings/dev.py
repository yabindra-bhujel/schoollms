# dev.py
from .base import *

DEBUG = True

import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default='postgres://root:h4A1808tOmkBUC3ZsXfQ1oyI0gpFCpLx@dpg-cnq12jv109ks73ecckc0-a.singapore-postgres.render.com/lms_db_pqo5',
        conn_max_age=600,
        ssl_require=False
    )
}

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
]