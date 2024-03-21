from celery import shared_task
import logging
from courses.models import Subject
from .models import CalenderModel
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

@shared_task
def generate_events():
    subject_codes = []
    subjects = Subject.objects.all()
    for subject in subjects:
        subject_codes.append(subject.subject_code)

    for subject in subjects:
            dates = generate_matching_dates(subject.weekday)
            for d in dates:
                have_event = CalenderModel.objects.filter(subject=subject, start_date=d).exists()
                if not have_event:
                    print("create event")
                    event = CalenderModel.objects.create(
                        title=subject.subject_name,
                        start_date=d,
                        end_date=d,
                        start_time=subject.period_start_time,
                        end_time=subject.period_end_time,
                        color='red',
                        subject=subject
                    )
                    event.save()
                 
        

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
