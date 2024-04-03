from courses.subjects.models import SubjectRegistration

from ..models import Teacher
from django.contrib.auth import get_user_model

User = get_user_model()

class TeacherClassService:

    @staticmethod
    def get_teacher_class(username):
        """
        Retrieve data to display teacher class schedule.
        """
        try:
            user = User.objects.get(username=username)
            teacher = Teacher.objects.get(user=user)
            subject_registrations = SubjectRegistration.objects.filter(teacher=teacher).select_related('subject', 'teacher').order_by('subject__weekday', 'subject__period_start_time')
            class_data = []
            for registration in subject_registrations:
                class_data.append({
                    'subject_name': registration.subject.subject_name,
                    'subject_code': registration.subject.subject_code,
                    'class_room': registration.subject.class_room,
                    'weekday': registration.subject.weekday,
                })

            return class_data
        except User.DoesNotExist:
            return None
        except Teacher.DoesNotExist:
            return None
