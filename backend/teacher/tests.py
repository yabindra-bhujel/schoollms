from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from .models import Teacher
User = get_user_model()

class TestAPITeacher(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(username='34234', password='pass', is_staff=True, is_superuser=True)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.teacher = Teacher.objects.create(
            TeacherID=34234,
            first_name='John',
            last_name='Doe',
            gender='Male',
            email='teacher@example.com',
            phone='1234567890',
            address='123 Street, City',
            date_of_birth='2000-01-01',
            image=None)

    def tearDown(self):
        super().tearDown()
        self.user.delete()

    def test_create_teacher(self):
        url = reverse('create_teacher')
        teacher_data = {
            'teacherID': 1232132,
            'first_name': 'Jane',
            'last_name': 'Smith',
            'gender': 'Female',
            'email': 'jane@example.com',
            'phone': '9876543210',
            'address': '456 Avenue, Town',
            'date_of_birth': '1995-05-05',
            'image': None}
        
        response = self.client.post(url, teacher_data, format='json')
        self.assertEqual(url, '/teacher/add/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_teacher_list(self):
        url = reverse('teacher_list')
        response = self.client.get(url)
        self.assertEqual(url, '/teacher/list/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_teacher_detail(self):
        url = reverse('teacher_detail', args=[self.teacher.TeacherID])
        response = self.client.get(url)
        self.assertEqual(url, f'/teacher/{self.teacher.TeacherID}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(type(response.data), dict)

    def test_delete_teacher(self):
        url = reverse('delete_teacher', args=[self.teacher.TeacherID])
        response = self.client.delete(url)
        self.assertEqual(url, f'/teacher/delete/{self.teacher.TeacherID}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_teacher_today_class(self):
        url = reverse('get_teacher_today_class')
        response = self.client.get(url)
        self.assertEqual(url, '/teacher/get_teacher_today_class/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(type(response.data), list)
