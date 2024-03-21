from datetime import datetime, timedelta
from .models import CalenderModel
from courses.models import Subject

class GenerateEvent:
    MONTHS_TO_GENERATE = 3

    def generate_events(self, subject_id):
        try:
            subject = Subject.objects.get(id=subject_id)
            event_week_days = subject.weekday.split(',')
            dates = self.generate_matching_dates(event_week_days)
            for date in dates:
                if not self.event_already_exists(subject, date):
                    self.create_event(subject, date)
            return True, 'Events generated successfully'
        
        except Exception as e:
            return False, str(e)
            
    def generate_matching_dates(self, event_days):
        today = datetime.now()
        all_matching_dates = []

        for _ in range(self.MONTHS_TO_GENERATE):
            first_day_of_month = today.replace(day=1)
            last_day_of_month = (first_day_of_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            all_dates = [first_day_of_month + timedelta(days=i) for i in range((last_day_of_month - first_day_of_month).days + 1)]
            matching_dates = [date.strftime('%Y-%m-%d') for date in all_dates if date.strftime('%A') in event_days]
            all_matching_dates.extend(matching_dates)
            today = today.replace(day=1) + timedelta(days=32)

        return all_matching_dates

    def event_already_exists(self, subject, date):
        return CalenderModel.objects.filter(title=subject.subject_name, start_date=date).exists()

    def create_event(self, subject, date):
        if self.event_already_exists(subject, date):
            return
        event = CalenderModel.objects.create(
            title=subject.subject_name,
            start_date=date,
            end_date=date,
            time=subject.period_start_time,
            color='red'
        )
        event.save()
