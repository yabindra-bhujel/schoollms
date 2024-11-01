from celery import shared_task
import logging
from datetime import datetime, timedelta
from courses.subjects.models import Subject
from .models import CalendarEvent, Notification, UserNotification
from datetime import datetime
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

import logging
from datetime import timedelta
from django.conf import settings
from django.core.mail import send_mail, send_mass_mail
from django.utils import timezone
from celery import shared_task
from .models import CalendarEvent

logger = logging.getLogger(__name__)

@shared_task
def send_reminder_notification():
    now = timezone.now()
    today = now.date()
    current_time = now.time()

    # Define a time window (e.g., 1 minute) to prevent timing discrepancies
    time_window_start = (now - timedelta(minutes=1)).time()
    time_window_end = (now + timedelta(minutes=1)).time()

    reminders = CalendarEvent.objects.filter(
        start_date=today,
        reminder_time__range=(time_window_start, time_window_end),
        reminder_time__isnull=False,
        is_reminder_sent=False,
    )

    if not reminders.exists():
        logger.info("No reminders to send")
        return

    email_messages = []
    for event in reminders:
        if event.user and event.user.email:
            subject = f"Reminder: {event.title}"
            message = generate_email_content(event)
            email_messages.append((subject, message, settings.EMAIL_HOST_USER, [event.user.email]))
            event.is_reminder_sent = True
            event.save()

    if email_messages:
        try:
            send_mass_mail(email_messages, fail_silently=False)
            logger.info(f"{len(email_messages)} reminder(s) sent.")
        except Exception as e:
            logger.error(f"Error sending batch email: {e}")

    # create application notification
    for event in reminders:
        notification = Notification.objects.create(
            title=f"Reminder: {event.title}",
            content=generate_email_content(event),
        )
        notification.user.add(event.user)
        notification.save()

        user_notification = UserNotification.objects.create(
            user=event.user,
            notification=notification,
        )
        user_notification.save()

def generate_email_content(event):
    """Generate the email content for a given event."""
    return f"You have an event today: {event.title} at {event.start_time}. Don't forget!"

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