import re
from courses.models import Department
from ..serializers import SubjectSerializer
from teachers.models import Teacher

class SubjectService:
    def __init__(self, data):
        self.__data = data

    def create_subject(self):
        department_code = self.__extract_department_code(self.__data.get('subject_faculty'))
        teacher_id = self.__extract_teacher_id(self.__data.get('teacher_name'))

        if not department_code or not teacher_id:
            return {'error': 'Invalid input data'}

        start_time, end_time = self.__calculate_time(self.__data.get('class_period'))

        try:
            department = Department.objects.get(department_code=department_code)
        except Department.DoesNotExist:
            return {'error': f"Department '{department_code}' does not exist."}
        
        try:
            teacher = Teacher.objects.get(teacher_id=teacher_id)
        except Teacher.DoesNotExist:
            return {'error': f"Teacher '{teacher_id}' does not exist."}

        subject_data = {
            'subject_name': self.__data.get('course_name'),
            'subject_code': self.__data.get('course_code'),
            'weekday': self.__data.get('weekday'),
            'class_period': self.__data.get('class_period'),
            'subject_faculty': department.id,
            'teacher': teacher.teacher_id,
            'period_start_time': start_time,
            'period_end_time': end_time,
        }

        subject_serializer = SubjectSerializer(data=subject_data)
        if subject_serializer.is_valid():
            subject_serializer.save()
            return subject_serializer.data
        else:
            return {'error': subject_serializer.errors}

    def __extract_department_code(self, department_data):
        match = re.search(r'\b(\d{3})\b', department_data)
        if match:
            return match.group(1)
        return None

    def __extract_teacher_id(self, teacher_name):
        match = re.search(r'\b(\d{10})\b', teacher_name)
        if match:
            return match.group(1)
        return None

    def __calculate_time(self, class_period):
        period_start_time = {
            '1': '9:00',
            '2': '10:40',
            '3': '13:00',
            '4': '14:40',
        }

        period_end_time = {
            '1': '10:30',
            '2': '12:10',
            '3': '14:30',
            '4': '16:10',
        }

        start_time = period_start_time.get(str(class_period), 'N/A')
        end_time = period_end_time.get(str(class_period), 'N/A')
        return start_time, end_time

