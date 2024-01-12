from django.test import TestCase
from student.models import Student
from django.contrib.auth import get_user_model

User = get_user_model()


class TestStudetnModel(TestCase):
    
    def setUp(self):
        self.student = Student.objects.create(
            studentID = "113123123",
            first_name = "Test Student",
            last_name = "Last Name",
            gender = "Male",
            date_of_birth = "2021-01-22",
            phone = "Test phone",
        )

    def test_student_model(self):
        # Verify the fields are correct
        student = Student.objects.get(studentID=self.student.studentID)
