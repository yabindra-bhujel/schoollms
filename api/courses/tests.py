from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from.models import Department
from teachers.models import Teacher
from .subjects.models import Subject

User = get_user_model()

class TestAdminAPICourse(APITestCase):
    
        def setUp(self):
            super().setUp()
            self.admin_user = User.objects.create_user(username='admin', password='pass', is_staff=True, is_superuser=True)
            self.client = APIClient()
            self.client.force_authenticate(self.admin_user)
            self.test_department = Department.objects.create(department_name='Test Department', department_code='1234')
            self.user = User.objects.create_user(username='test', password='pass', is_teacher=True)
          
            self.test_subject = Subject.objects.create(
                subject_name='Test Subject',
                subject_code='1234',
                weekday='Monday',
                period_start_time = '08:00:00',
                period_end_time = '09:00:00',
                class_room = 'U101',
                class_period = '1',
                subject_faculty=self.test_department,
            )


        def test_department(self):
            url = '/api/admin/departments/'

            data = {
                'department_name': 'Test Department',
                'department_code': '1234'
            }

            response = self.client.post(url, data, format='json')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(response.data['department_name'], 'Test Department')
            self.assertEqual(response.data['department_code'], '1234')

            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            actual_data = response.data
            id = actual_data[0]['id']
            self.assertEqual(actual_data[0]['department_name'], 'Test Department')
            self.assertEqual(actual_data[0]['department_code'], '1234')

            url = f'/api/admin/departments/{id}/'
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['department_name'], 'Test Department')
            self.assertEqual(response.data['department_code'], '1234')
            self.assertEqual(response.data['id'], id)


            response = self.client.put(url, {'department_name': 'New Department', 'department_code': '5678'}, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['department_name'], 'New Department')
            self.assertEqual(response.data['department_code'], '5678')
            self.assertEqual(response.data['id'], id)

        def test_subject(self):

            url = '/api/admin/subject/'

            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            actual_data = response.data
            subject_code = actual_data[0]['subject_code']
            self.assertEqual(actual_data[0]['subject_name'], 'Test Subject')
            self.assertEqual(actual_data[0]['subject_code'], '1234')
            self.assertEqual(actual_data[0]['weekday'], 'Monday')
            self.assertEqual(actual_data[0]['period_start_time'], '08:00:00')
            self.assertEqual(actual_data[0]['period_end_time'], '09:00:00')
            self.assertEqual(actual_data[0]['class_room'], 'U101')
            self.assertEqual(actual_data[0]['class_period'], '1')


            url = f'/api/admin/subject/{subject_code}/'
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['subject_name'], 'Test Subject')
            self.assertEqual(response.data['subject_code'], '1234')
            self.assertEqual(response.data['weekday'], 'Monday')
            self.assertEqual(response.data['period_start_time'], '08:00:00')
            self.assertEqual(response.data['period_end_time'], '09:00:00')
            self.assertEqual(response.data['class_room'], 'U101')