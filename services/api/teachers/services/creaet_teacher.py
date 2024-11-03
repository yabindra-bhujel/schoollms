from django.db import transaction
from django.core.exceptions import ValidationError
from utils.user_create import UserCreator
from ..models import Teacher
from ..serializers import TeacherSerializer
import json

class TeacherCreator:
    def __init__(self, data: dict):
        self.__data = data
        self.__user = None
        self.__teacher = None
        self.__teacher_id = self.__data.get('teacher_id')
        self.__password = None

    def create_teacher(self) -> dict:
        try:
            with transaction.atomic():
                dob = self.__data.get('date_of_birth')
                dob = dob.replace('-', '')
                self.__password = dob

                self.__user = UserCreator(is_student=False, is_teacher=True, username=self.__teacher_id, data=self.__data, password=self.__password).create_user()
                self.__create_teacher()

                return json.dumps(TeacherSerializer(self.__teacher).data)
                
        except ValidationError as e:
            return {'error': str(e)}

    def __create_teacher(self):

        if self.__teacher_id is None and self.__user is None:
            raise ValidationError("Teacher ID and User cannot be None.")
        
        try:
            email = self.__data.get('email')
        
            self.__teacher = Teacher(
                teacher_id=self.__teacher_id,
                first_name=self.__data.get('first_name'),
                last_name=self.__data.get('last_name'),
                email=email,
                gender=self.__data.get('gender'),
                date_of_birth=self.__data.get('date_of_birth'),
                user=self.__user
            )
            self.__teacher.save()
        except ValidationError as e:
            raise ValidationError(str(e))
