from django.test import TestCase
from teacher.models import Teacher
from django.contrib.auth import get_user_model

User = get_user_model()

class TestModel(TestCase):
    def setUp(self):
        self.teacher = Teacher.objects.create(
            TeacherID="2121",  # Set as an integer
            first_name="Test Teacher",
            last_name="Last Name",
            gender="Male",
            phone="Test phone",
            address="Test address",
            image="Test image",
            date_of_birth="2021-01-22"
        )


    def test_teacher_model(self):
        teacher = Teacher.objects.get(TeacherID=self.teacher.TeacherID)

      

