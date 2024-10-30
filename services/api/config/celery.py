# config/celery.py

import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')

app = Celery('config')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'update-assignment-status': {
        'task': 'courses.tasks.update_assignment_status',
        'schedule': crontab(minute='*'),
    },
    'send-reminder-email': {
        'task': 'courses.tasks.send_reminder_email',
        'schedule': crontab(minute='*'),
    },
    'send-passed-deadline-email': {
        'task': 'courses.tasks.send_passed_deadline_email',
        'schedule': crontab(minute='*'),
    },
       'generate-events': {
        'task': 'common.tasks.generate_events',
        'schedule': crontab(minute='*'),
    },

    'send-reminder-notification': {
        'task': 'common.tasks.send_reminder_notification',
        'schedule': crontab(minute='*'),
    },
}
