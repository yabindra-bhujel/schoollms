import re
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from ..models import Subject, SubjectRegistration
from students.models import Student
from teachers.models import Teacher
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

class SubjectRegisterService:
    def __init__(self, request_data):
        self.__students = request_data.get('student')
        self.__teacher_data = request_data.get('subject_teacher')
        self.__course_data = request_data.get('subject_name')


    def register(self):
        students = []
        try:
            student_ids = self.__extract_student_id()
            teacher_id = self.__extract_teacher_id()
            
            with transaction.atomic():
                for student_id in student_ids:
                    student = Student.objects.get(student_id=student_id)
                    students.append(student)
                if not students:
                    logger.error("Student does not exist")
                    raise ObjectDoesNotExist("Student does not exist")

                teacher = Teacher.objects.get(teacher_id=teacher_id)
                if not teacher:
                    logger.error("Teacher does not exist")
                    raise ObjectDoesNotExist("Teacher does not exist")
                
                subject = Subject.objects.get(subject_name=self.__course_data)
            
                subject_registration = SubjectRegistration.objects.filter(subject=subject)
                if subject_registration.exists():
                    subject_registration = subject_registration.first()
                    subject_registration.teacher = teacher
                    subject_registration.student.set(students)
                    subject_registration.save()
                else:
                    subject_registration = SubjectRegistration.objects.create(subject=subject , teacher=teacher)
                    subject_registration.student.set(students)
                    subject_registration.save()

            return subject_registration
        
        except ObjectDoesNotExist as e:
            logger.error(f"Error registering subject: {e}")
            return {'error': str(e)}

    def __extract_student_id(self):
        student_ids = []
        for student in self.__students:
            match = re.search(r'S?\d+$', student)
            if match:
                student_ids.append(match.group(0))
        return student_ids


    def __extract_teacher_id(self):
        match = re.search(r'\d+$', self.__teacher_data)
        if match:
            return match.group(0)


    def __register_subject(self, student_ids, teacher_id):
        teacher = Teacher.objects.get(TeacherID=teacher_id)
        
        students = []
        for student_id in student_ids:
            student = Student.objects.get(studentID=student_id)
            students.append(student)

        subject = Subject.objects.get(subject_name=self.__course_data)

        subject_enroll, created = SubjectRegistration.objects.get_or_create(course=subject)
        subject_enroll.teacher = teacher
        subject_enroll.student.set(students)
        subject_enroll.save()
