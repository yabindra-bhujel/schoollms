from django.core.exceptions import ValidationError
from ..models import CalendarEvent
from students.models import Student
from teachers.models import Teacher
from courses.subjects.models import SubjectRegistration, Subject
from django.utils import timezone
from datetime import datetime

class CalendarService:

    @staticmethod
    def create_event(user, data):
        event = CalendarEvent.objects.create(
            title = data['title'],
            start_date = data['start_date'],
            end_date = data['end_date'],
            color = data['color'],
            start_time = data['start_time'],
            end_time = data['end_time'],
            user = user,
        )
        return event
    

    @staticmethod
    def cancel_class(event):
        if not event.subject:
            raise ValidationError("This event does not have a subject")

        today = datetime.date.today()
        if event.start_date < today:
            raise ValidationError("Cannot cancel a class that has already started or has already ended")

        event.is_class_cancellation = not event.is_class_cancellation
        event.save()

        return event
    

    @staticmethod
    def get_calendar_events(user):
        calendar_events = CalendarEvent.objects.none() 
        
        if user.is_student:
            student = Student.objects.get(user=user)
            enrolled_subjects = SubjectRegistration.objects.filter(student=student)
            subject_ids = enrolled_subjects.values_list('subject_id', flat=True)
            subjects = Subject.objects.filter(id__in=subject_ids)
            for subject in subjects:
                calendar_events |= CalendarEvent.objects.filter().prefetch_related('subject').filter(subject=subject)
        
        if user.is_teacher:
            teacher = Teacher.objects.get(user=user)
            enrolled_subjects = SubjectRegistration.objects.filter(teacher=teacher)
            subject_ids = enrolled_subjects.values_list('subject_id', flat=True)
            subjects = Subject.objects.filter(id__in=subject_ids)
            for subject in subjects:
                calendar_events |= CalendarEvent.objects.filter().prefetch_related('subject').filter(subject=subject)
        
        calendar_events |= CalendarEvent.objects.filter().prefetch_related('user').filter(user=user)
        
        return calendar_events


        

    @staticmethod
    def update_event_date(data):
        start_date_data = data.get('start', None)
        event_id = data.get('id', None)

        if start_date_data is not None and event_id is not None:
            event = CalendarEvent.objects.get(id=event_id)
            
            start_datetime = datetime.fromisoformat(start_date_data[:-1])
            end_datetime = datetime.fromisoformat(start_date_data[:-1])
            
            start_date_aware = timezone.make_aware(start_datetime)
            end_date_aware = timezone.make_aware(end_datetime)
            
            start_date = start_date_aware.date()
            end_date = end_date_aware.date()

            event.start_date = start_date
            event.end_date = end_date
            event.save()
            return event

        else:
            raise ValidationError("Invalid data provided")
