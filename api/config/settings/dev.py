# dev.py
from .base import *

import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default='postgres://ffff_ho5b_user:fVW7DcuDIMlAvCio7M5Pw1fXlIEdrE31@dpg-co345t0l5elc73d730n0-a.oregon-postgres.render.com/ffff_ho5b',
        conn_max_age=600,
        ssl_require=False
    )
}

DEBUG = True


# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'final_lms',   
#         'USER': 'admin',         
#         'PASSWORD': 'yabindra12',      
#         'HOST': 'localhost',     
#         'PORT': '5432',         
#     }
# }
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
]