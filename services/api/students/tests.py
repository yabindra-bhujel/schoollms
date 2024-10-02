from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from courses.models import Department


User = get_user_model()

class StudentTest(APITestCase):

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(username='normal', password='pass')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.department = Department.objects.create(department_name = 'Test Department', department_code = '1234')

    def test_create_student(self):

        url = '/api/admin/students/'

        data = {
            'student_id': '123456',
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'email@gmail.com',
            'phone': '1234567890',
            'address': '123 Main St',
            'city': 'Anytown',
            'gender': 'Male',
            'state': 'CA',
            'zip': '12345',
            'country': 'USA',
            'date_of_birth': '2000-01-01',
            'department': self.department.department_code,
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.user.is_staff = True

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['student_id'], '123456')
        self.assertEqual(response.data['first_name'], 'Test')
        self.assertEqual(response.data['last_name'], 'User')
        self.assertEqual(response.data['phone'], '1234567890')  

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actual_data = response.data
        student_id = actual_data[0]['student_id']
        self.assertEqual(actual_data[0]['student_id'], '123456')
        self.assertEqual(actual_data[0]['first_name'], 'Test')
        self.assertEqual(actual_data[0]['last_name'], 'User')
        self.assertEqual(actual_data[0]['phone'], '1234567890')

        url = f'/api/admin/students/{student_id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['student_id'], '123456')
        self.assertEqual(response.data['first_name'], 'Test')
        self.assertEqual(response.data['last_name'], 'User')
        self.assertEqual(response.data['phone'], '1234567890')

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)