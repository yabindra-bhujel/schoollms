from courses.subjects.models import SubjectRegistration

from ..models import Student
from django.contrib.auth import get_user_model

User = get_user_model()

class StduentClassService:

    @staticmethod
    def get_student_class_data(username):
        """
        Retrieve data to display student class schedule.
        """
        try:
            user = User.objects.get(username=username)
            student = Student.objects.get(user=user)
            subject_registrations = SubjectRegistration.objects.filter(student=student).select_related('subject', 'teacher').order_by('subject__weekday', 'subject__period_start_time')
            class_data = []
            for registration in subject_registrations:
                class_data.append({
                    'subject_name': registration.subject.subject_name,
                    'subject_code': registration.subject.subject_code,
                    'class_room': registration.subject.class_room,
                    'teacher_name': f"{registration.teacher.first_name} {registration.teacher.last_name}" if registration.teacher else "",
                    'weekday': registration.subject.weekday,
                })

            return class_data
        except User.DoesNotExist:
            return None
        except Student.DoesNotExist:
            return None
