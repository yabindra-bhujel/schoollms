from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from .models import Student
from courses.models import Department
User = get_user_model()

class TestAPIStudent(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(username='34234', password='pass', is_staff=True, is_superuser=True)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.department = Department.objects.create(
            Department_name='Computer Science',
            Department_code='101',
        )
        self.teacher = Student.objects.create(
            studentID=34234,
            first_name='John',
            last_name='Doe',
            gender='Male',
            date_of_birth='2000-01-01',
            email = 'studnet@gmail.com',
            phone = '1234567890',
            department = self.department,
            image=None)

    def tearDown(self):
        super().tearDown()
        self.user.delete()

    def test_create_teacher(self):
        url = reverse('add_newStudent')
        student_data = {
            'studentID': 1232132,
            'first_name': 'Jane',
            'last_name': 'Smith',
            'gender': 'Female',
            'email': 'jane@example.com',
            'phone': '9876543210',
            'address': '456 Avenue, Town',
            'date_of_birth': '1995-05-05',
            'department': self.department.Department_name,
            'image': None}
        
        response = self.client.post(url, student_data, format='json')
        self.assertEqual(url, '/student/add/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Student.objects.count(), 2)
        self.assertEqual(Student.objects.get(studentID=1232132).first_name, 'Jane')

    def test_get_student_detail(self):
        url = reverse('student_detail', args=[self.teacher.studentID])
        response = self.client.get(url)
        self.assertEqual(url, f'/student/{self.teacher.studentID}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(type(response.data), dict)
        self.assertEqual(Student.objects.count(), 1)

    def test_delete_student(self):
        url = reverse('delete_student', args=[self.teacher.studentID])
        response = self.client.delete(url)
        self.assertEqual(url, f'/student/delete_student/{self.teacher.studentID}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Student.objects.count(), 0)
