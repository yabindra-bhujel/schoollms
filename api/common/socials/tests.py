from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from common.socials.models import Message


User = get_user_model()

class MessageAPINotes(APITestCase):

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(username='normal', password='pass')
        self.first_user = User.objects.create_user(username='normal1', password='pass')
        self.second_user = User.objects.create_user(username='normal2', password='pass')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.message = Message.objects.create(sender=self.first_user, receiver=self.second_user, message="Hello")



    def test_message(self):
        url = '/api/socials/save_message/'

        data = {
            "sender": self.first_user.username,
            "receiver": self.second_user.username,
            "message": "Hello"
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], "Message sent successfully")

        url = '/api/socials/message/normal1/normal2/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['messages']), 2)


        url = '/api/socials/user_list/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_group(self):
        url = '/api/groups/create_group/'

        data = {
            "group_name": "Test Group",
            "users": [self.first_user.username, self.second_user.username]
        }


        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], "Group created successfully")

        url = '/api/groups/group_list/'
        response = self.client.get(url)
        id = response.data['groups'][0]['id']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['groups']), 1)


        url = '/api/groups/save_group_message/'
        
        data = {
            "group_id": 1,
            "group_name": "Test Group",
            "message": "Hello",
            "sender": self.first_user.username
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], "Message sent successfully")

        url = f'/api/groups/group_message/{id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['messages']), 1)
        self.assertEqual(response.data['messages'][0]['message'], "Hello")

        url = f'/api/groups/leave_group/{id}/'
        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Left group successfully")

        url = f'/api/groups/delete_group/{id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)