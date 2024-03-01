from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from.models import *
from tenant.models import UserProfile
User = get_user_model()

class BaseTest(APITestCase):
    pass

class TestDepartment(BaseTest):
    pass