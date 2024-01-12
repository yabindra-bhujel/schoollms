from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase
from django.contrib.auth import get_user_model
from notification.models import *
from notification.views import *


User = get_user_model()



class TestCreateVideo(APITestCase):
    databases = {'default'}  # Explicitly allow database access

    def setUp(self):
        self.factory = APIRequestFactory()
        self.getCalender_event = reverse('getCalender_event', args=['testuser'])
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Create Event for test
        self.calender = CalenderModel.objects.create(
            user=self.user,
            title="Test Event",
            start_date="2021-05-05",
            end_date="2021-05-05",
            time="10:00:00",
            allDay=True,
            color="red"
        )

    def test_getCalender_event(self):
        # Log in the user
        self.client.login(username='testuser', password='testpassword')

        calender_data = {
            "id": 1,
            "user": self.user.id,
            "title": "Test Event",
            "start_date": "2021-05-05",
            "end_date": "2021-05-05",
            "time": "10:00:00",
            "allDay": True,
            "color": "red"
        }

        # Create a GET request
        request = self.factory.get(self.getCalender_event, calender_data, format='json')

        request.user = self.user

        # Call view function directly with the request
        response = getCalender_event(request, username='testuser')  # Provide the username as an argument

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(CalenderModel.objects.filter(title="Test Event").exists())
