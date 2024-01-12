from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

def create_user(username='testuser', email='test@example.com', password='testpass123'):
    return User.objects.create_user(username=username, email=email, password=password)


class CreateUserTestCase(APITestCase):
    def test_create_new_user_valid(self):
        url = reverse('create_new_user')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newPassword123', # Valid password
            'confirm_password': 'newPassword123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)


    def test_create_new_user_invalid(self):
        """
        Ensure user creation fails with invalid data.
        """
        url = reverse('create_new_user')  
        data = {
            'username': '',  # Invalid username
            'email': 'user@example.com',
            'password': 'password',
            'confirm_password': 'password'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class UniversityLoginScreenInfoTestCase(APITestCase):
    def test_get_login_screen_info(self):
        """
        Ensure we can retrieve login screen info.
        """
        url = reverse('get_university_login_screen_info')  # Adjust URL name
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class UserProfilePicTestCase(APITestCase):
    def setUp(self):
        self.user = create_user()

    def test_get_user_profile_pic(self):
        """
        Ensure we can retrieve user profile picture.
        """
        url = reverse('get_user_profile_pic', kwargs={'username': self.user.username})  # Adjust URL name
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)




class ChangePasswordTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='oldpassword123'
        )

    def test_change_password_valid(self):
        url = reverse('change_password')
        data = {
            'user_id': self.user.id,
            'email': self.user.email,
            'old_password': 'oldpassword123',
            'confirm_password': 'newpassword123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Update the expected status code to 400



