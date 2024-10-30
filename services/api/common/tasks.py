from celery import shared_task
import logging
from datetime import datetime, timedelta
from courses.subjects.models import Subject
from .models import CalendarEvent
from datetime import datetime
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

@shared_task
def send_reminder_notification():
    today = datetime.now().strftime('%Y-%m-%d')

    reminder = CalendarEvent.objects.filter(
        start_date=today,
        reminder_time__isnull=False,
        is_reminder_sent=False,
    )

    if not reminder.exists():
        logger.info('No reminder to send')
        return

    for event in reminder:
        email = event.user.email
        subject = f'Reminder: {event.title}'
        message = f'You have an event today: {event.title} at {event.start_time}'

        try:
            send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                    fail_silently=False,
                )
            event.is_reminder_sent = True
            event.save()
            logger.info(f'Reminder sent to {email}')
            
        except Exception as e:
            logger.error(f'Error sending email: {e}')

@shared_task
def generate_events():
    subject_codes = []
    subjects = Subject.objects.all()
    for subject in subjects:
        subject_codes.append(subject.subject_code)

    for subject in subjects:
            dates = generate_matching_dates(subject.weekday)
            for d in dates:
                have_event = CalendarEvent.objects.filter(subject=subject, start_date=d).exists()
                if not have_event:
                    event = CalendarEvent.objects.create(
                        title=subject.subject_name,
                        start_date=d,
                        end_date=d,
                        start_time=subject.period_start_time,
                        end_time=subject.period_end_time,
                        color='red',
                        subject=subject
                    )
                    event.save()
                
    logger.info('Events generated successfully')
                 
        

def generate_matching_dates(event_days):
    today = datetime.now()
    all_matching_dates = []

    for _ in range(2):
        first_day_of_month = today.replace(day=1)
        last_day_of_month = (first_day_of_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        all_dates = [first_day_of_month + timedelta(days=i) for i in range((last_day_of_month - first_day_of_month).days + 1)]
        matching_dates = [date.strftime('%Y-%m-%d') for date in all_dates if date.strftime('%A') in event_days]
        all_matching_dates.extend(matching_dates)
        today = today.replace(day=1) + timedelta(days=32)

    return all_matching_dates