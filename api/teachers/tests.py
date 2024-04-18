from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from teachers.models import Teacher

User = get_user_model()

class TestAPITeacher(APITestCase):

    def setUp(self):
        super().setUp()
        self.admin_user = User.objects.create_user(username='admin', password='pass', is_staff=True, is_superuser=True)
        self.client = APIClient()
        self.client.force_authenticate(self.admin_user)

    def test_teacher_creation(self):

        pass
    