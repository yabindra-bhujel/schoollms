import datetime
from .models import CalenderModel
from student.models import Student
from teacher.models import Teacher
from courses.models import SubjectEnroll
import logging
logger = logging.getLogger(__name__)

def get_calendar_events(user):
    try:
        calendar_events = CalenderModel.objects.none() 
        
        if user.is_student:
            student = Student.objects.get(user=user)
            enrolled_subjects = SubjectEnroll.objects.filter(student=student)
            subject_ids = enrolled_subjects.values_list('course__id', flat=True)
            calendar_events |= CalenderModel.objects.filter(subject_id__in=subject_ids)
        
        if user.is_teacher:
            teacher = Teacher.objects.get(user=user)
            calendar_events |= CalenderModel.objects.filter(subject__subject_teacher=teacher)
        
        calendar_events |= CalenderModel.objects.filter(user=user)
        
        return calendar_events
    
    except Exception as e:
        raise Exception(e)
    
def make_class_cancellation(event):
    try:
       print(event)
       
    except Exception as e:
        raise Exception(e)
