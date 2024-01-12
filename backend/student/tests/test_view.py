from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase
from django.contrib.auth import get_user_model
from student.models import Student
from student.views import student_list, student_detail, add_newStudent

User = get_user_model()


class TestStudentView(APITestCase):
    databases = {'default'}
    def setUp(self):
        self.factory=APIRequestFactory()
        self.create_student_url=reverse('add_newStudent')


        self.student=Student.objects.create(
            studentID = "123434",
            first_name = "test",
            last_name = "test",
            gender =  "Male",
            date_of_birth = "2021-09-09",
            phone = "Phone",
        )



    def test_add_new_student(self):
        student_data = {
             "studentID": "202122",
            "first_name": "Yabindra",
            "last_name": "Bhujel",
            "gender": "Male",
            "date_of_birth": "2001-03-25",
            "phone": "080777789"
        }
        request = self.factory.post(path=self.create_student_url, data=student_data)
        response = add_newStudent(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)



    def test_student_list(self):
        request = self.factory.get('/student/')
        response = student_list(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_student_detail(self):
        request = self.factory.get('/student/123434/')
        response = student_detail(request, studentID='123434')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn('student', response.data)
        self.assertIn('courses', response.data)
