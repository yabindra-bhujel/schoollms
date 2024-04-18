from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from .models import UserProfile

User = get_user_model()

class AuthTest(APITestCase):

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(username='normal', password='pass', is_staff=True, is_superuser=True)
        self.admin = User.objects.create_superuser(username='admin', password='pass')
        self.teacher = User.objects.create_user(username='teacher', password='pass', is_teacher=True)
        self.student = User.objects.create_user(username='student', password='pass', is_student=True)
        self.client = APIClient()
        self.user_profile = UserProfile.objects.create(user=self.user)


    def test_login(self):
        response = self.client.post('/api/login/', {'username': 'normal', 'password': 'pass'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

        response = self.client.post('/api/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post('/api/login/', {'username': 'normal', 'password': 'wrong'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.post('/api/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post('/api/login/', {'username': 'student', 'password': 'pass'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

        url = '/api/token/'
        response = self.client.post(url, {'username': 'student', 'password': 'pass'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)


    def test_password(self):
        response = self.client.post('/api/password/chnage_password/', {'old_password': 'pass', 'new_password': 'newpass'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/password/chnage_password/', {'old_password': 'pass', 'new_password': 'newpass', 'confirm_password': 'newpass'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post('/api/login/', {'username': 'normal', 'password': 'newpass'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

        # TODO: test password reset

    def test_user(self):

        url = '/api/users/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(f'{url}{self.user.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(f'{url}{self.admin.id}/')
        id = self.admin.id
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        url = f'/api/users/{id}/'
        response = self.client.put(url, {'username': 'newuser'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        url = '/api/users/admin/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        url = '/api/users/profile_details/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)