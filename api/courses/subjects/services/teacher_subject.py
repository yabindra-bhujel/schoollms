
from courses.subjects.models import Subject, Assignment, SubjectRegistration
from teachers.models import Teacher
from django.core.exceptions import ObjectDoesNotExist
from ..serializers import SubjectSerializer, SubjectRegistrationSerializer



class TeacherSubjectService:
    def __init__(self, subject_code, teacher_id):
        self.__subject_code = subject_code
        self.__teacher_id = teacher_id

    def get_teacher_subject(self):
        teahcer = Teacher.objects.get(teacher_id=self.__teacher_id)
        subject = Subject.objects.get(subject_code=self.__subject_code)

        if not teahcer and not subject:
            raise ObjectDoesNotExist("Teacher or Subject does not exist")
        
        enrollment = SubjectRegistration.objects.get(teacher=teahcer, subject=subject)
        serializer = SubjectRegistrationSerializer(enrollment).data
        subject_data = SubjectSerializer(subject).data
        
        subject_data = [
            serializer,
            subject_data
        ]




        return subject_data













