from students.serializers import StudentSerializer
from ..models import Student
from courses.models import Department
from django.db import transaction
from django.core.exceptions import ValidationError
from utils.user_create import UserCreator

class StudentCreator:
    def __init__(self, data: dict):
        self.__data = data
        self.__department_object = None
        self.__user = None
        self.__student = None
        self.__username = self.__data.get('student_id')

    def create_student(self) -> dict:
        try:
            with transaction.atomic():
                self.__user = UserCreator(is_student=True, is_teacher=False, username=self.__username, data=self.__data).create_user()
                self.__get_department_object()
                self.__create_student()

                return StudentSerializer(self.__student).data
                
        except ValidationError as e:
            return {'error': str(e)}


    def __get_department_object(self):
        department_code = self.__data.get('department')
        try:
            self.department_object = Department.objects.get(department_code=department_code)
        except Department.DoesNotExist:
            raise ValidationError(f"Department '{department_code}' does not exist.")

    def __create_student(self):
        self.__student = Student(
            student_id=self.__data.get('student_id'),
            first_name=self.__data.get('first_name'),
            last_name=self.__data.get('last_name'),
            email=self.__data.get('email'),
            phone=self.__data.get('phone'),
            gender=self.__data.get('gender'),
            date_of_birth=self.__data.get('date_of_birth'),
            city=self.__data.get('city'),
            state=self.__data.get('state'),
            country=self.__data.get('country'),
            image=self.__data.get('image'),
            department=self.__department_object,

            user=self.__user
        )
        self.__student.full_clean()
        self.__student.save()
