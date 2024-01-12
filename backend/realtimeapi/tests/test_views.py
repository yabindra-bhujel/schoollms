from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase
from django.contrib.auth import get_user_model
from realtimeapi.models import *
from realtimeapi.views import *

User = get_user_model()

class TestViews(APITestCase):
    databases = {'default'}
    def setUp(self):
        self.factory = APIRequestFactory()
        self.get_all_message_url = reverse('get_all_messages')


        # create user object for test
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # create message object for test
        self.message = Message.objects.create(
            sender=self.user,
            receiver=self.user,
            message="Test message",
            is_read=False,
            is_delivered = False
        )







    def test_get_all_messages_view(self):
        request = self.factory.get(self.get_all_message_url)
        response = all_messages(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    # def test_update_message_status_view(self):
    #     request = self.factory.put(self.get_all_message_url)
    #     response = update_message_status(request, sender='testuser', receiver='testuser')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)