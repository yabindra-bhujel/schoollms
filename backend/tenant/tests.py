from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from tenant.models import ApplicationSettings

User = get_user_model()

class BaseTestCase(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(username='user', password='pass')
        self.settings = ApplicationSettings.objects.create(user=self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def tearDown(self):
        super().tearDown()
        self.user.delete()
        self.settings.delete()

class TestAPIJWT(BaseTestCase):
    def test_api_jwt(self):
        url = reverse('token_obtain_pair')
        self.assertEqual(url, '/api/token/')
        resp = self.client.post(url, {'username': 'user', 'password': 'pass'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in resp.data)
        token = resp.data['access']
        print(token)

    def test_user_list(self):
        url = reverse('get_user_list')
        self.assertEqual(url, '/get_user_list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)

    def test_user_profile(self):
        url = reverse('profileDetails')
        self.assertEqual(url, '/profile_detalis')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['user']['username'], 'user')

    def test_user_profile_update(self):
        url = reverse('updateUserProfile')
        self.assertEqual(url, '/update_user_info')
        resp = self.client.post(url, {'username': 'user1', 'email': 'email@gmao.com', 'first_name': 'adasdsd', 'last_name': "dsads"}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

class TestApplicationSetting(BaseTestCase):
    def test_email_notification(self):
        url = reverse('haveEmailNotification')
        self.assertEqual(url, '/haveEmailNotification')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_two_factor_auth(self):
        url = reverse('check_have_two_factor_auth')
        self.assertEqual(url, '/havetwoFactorAuth')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_update_email_notification(self):
        url = reverse('updateEmailNotification')
        resp = self.client.put(url)
        self.assertEqual(url, '/updateEmailNotification')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
    
    def test_update_two_factor_auth(self):
        url = reverse('update_two_factor_auth')
        resp = self.client.put(url)
        self.assertEqual(url, '/update_two_factor_auth')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
