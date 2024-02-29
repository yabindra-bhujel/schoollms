from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from.models import *
from tenant.models import UserProfile
User = get_user_model()

class BaseTest(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="testuser1", password="testpassword1")
        self.user1_profile = UserProfile.objects.create(user=self.user1)
        self.user2 = User.objects.create_user(username="testuser2", password="testpassword2")
        self.user2_profile = UserProfile.objects.create(user=self.user2)

        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)
        self.client.force_authenticate(user=self.user2)
        self.calender = CalenderModel.objects.create(user=self.user1, title="test", start_date="2021-01-01", end_date="2021-01-01", time="10:00", color="red")
        self.note = Notes.objects.create(user=self.user2, title="test", content="test", note_type="private", color="red")
        self.notification = NotificationModel.objects.create(title="test", content="test")
        self.user_notification = UserNotification.objects.create(user=self.user1, notification=self.notification, is_read=False)


class TestCalender(BaseTest):
    def test_add_calender_event(self):
        url = reverse('addCalender_event')
        data = {
            "title": "test",
            "start_date": "2021-01-01",
            "end_date": "2021-01-01",
            "time": "10:00",
            "color": "red"
        }
        response = self.client.post(url, data)
        self.assertEqual(url, '/notification/addevent/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CalenderModel.objects.count(), 2)


    def test_get_calender_event(self):
        url = reverse('getCalender_event')
        response = self.client.get(url)
        self.assertEqual(url, '/notification/calendar/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_delete_calender_event(self):
        url = reverse('delete_event', args=[self.calender.id])
        response = self.client.delete(url)
        self.assertEqual(url, f'/notification/delete_event/{self.calender.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_today_event(self):
        url = reverse('getTodayEvent')
        response = self.client.get(url)
        self.assertEqual(url, '/notification/getTodayEvent/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CalenderModel.objects.count(), 1)
        self.assertEqual(response.data, [])


class TestNotes(BaseTest):
    def test_add_notes(self):
        url = reverse('addNotes')
        data = {
            "user": self.user1.username,
            "title": "test",
            "content": "test",
            "note_type": "private",
            "color": "red"
        }
        response = self.client.post(url, data)
        self.assertEqual(url, '/notification/addNotes/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Notes.objects.count(), 2)

    def test_get_notes(self):
        url = reverse('getNotes')
        response = self.client.get(url)
        self.assertEqual(url, '/notification/getNotes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Notes.objects.count(), 1)
        self.assertEqual(response.data[0]['title'], 'test')

    def test_delete_notes(self):
        url = reverse('deleteNotes', args=[self.note.id])
        response = self.client.delete(url)
        self.assertEqual(url, f'/notification/deleteNotes/{self.note.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_update_notes(self):
        url = reverse('updateNotes', args=[self.note.id])
        data = {
            "title": "test",
            "content": "test",
            "note_type": "private",
            "color": "red"
        }
        response = self.client.put(url, data)
        self.assertEqual(url, f'/notification/updateNotes/{self.note.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'test')

    def test_update_notes_title(self):
        url = reverse('updateNotesTitle', args=[self.note.id])
        data = {
            "title": "test"
        }
        response = self.client.put(url, data)
        self.assertEqual(url, f'/notification/updateNotesTitle/{self.note.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'test')

class TestNotification(BaseTest):
    def test_get_notification_by_user(self):
        url = reverse('get_notification_by_user', args=[self.user1.username])
        response = self.client.get(url)
        self.assertEqual(url, f'/notification/get_notification_by_user/{self.user1.username}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_notification(self):
        url = reverse('update_notification', args=[self.user1.username])
        response = self.client.put(url)
        self.assertEqual(url, f'/notification/update_notification/{self.user1.username}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


