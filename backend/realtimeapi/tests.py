from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from tenant.models import UserProfile
from .models import *
User = get_user_model()

class TestRealTimeApiTest(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="testuser1", password="testpassword1", email="email1@gmail.com")
        self.user1_profile = UserProfile.objects.create(user=self.user1)
        self.user2 = User.objects.create_user(username="testuser2", password="testpassword2", email="emai2@gmail.com")
        self.user2_profile = UserProfile.objects.create(user=self.user2)
        self.user3 = User.objects.create_user(username="testuser3", password="testpassword3", email="asjdsakjd@gmail.com")
        self.user3_profile = UserProfile.objects.create(user=self.user3)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)
        self.client.force_authenticate(user=self.user2)
        self.message = Message.objects.create(sender=self.user1, receiver=self.user2, message="Hello ...")
        self.group = Group.objects.create(admin=self.user1, name="testgroup")
        self.group.members.add(self.user1, self.user2)
        self.group_message = GroupMessage.objects.create(sender=self.user1, group=self.group, message="Hello ...")
        self.post = Post.objects.create(user=self.user1, text="Hello ...")
        self.comment = Comment.objects.create(post=self.post, user=self.user1, comment="Hello ...")
        self.client.force_authenticate(user=self.user1)


class TestMessage(TestRealTimeApiTest):

    def test_save_message_to_database(self):
        url = reverse('save_message_to_database')
        data = {
            "sender": self.user1.username,
            "receiver": self.user2.username,
            "message": "Hello"}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(url, '/api/realtimeapi/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def test_get_all_messages(self):
        url = reverse('get_all_messages', args=[self.user1.username, self.user2.username])
        response = self.client.get(url, format='json')
        self.assertEqual(url, '/api/realtimeapi/get_all_messages/testuser1/testuser2/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        messages = response.data.get('messages', [])
        self.assertTrue(messages) 
        self.assertEqual(messages[0]['sender'], self.user1.username)
        self.assertEqual(messages[0]['receiver'], self.user2.username)


    def test_update_message_status(self):
        url = reverse('update_message_status', args=[self.user1.username, self.user2.username])
        response = self.client.put(url, format='json')
        self.assertEqual(url, '/api/realtimeapi/update_message_status/testuser1/testuser2/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_user(self):
        url = reverse('get_all_user')
        response = self.client.get(url, format='json')
        self.assertEqual(url, '/api/realtimeapi/getalluser/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class TestGroup(TestRealTimeApiTest):
    
        def test_create_group(self):
            url = reverse('create_group')
            data = {
                "admin": self.user1.username,
                "group_name": "testgroup2",
                "users": [self.user1.username, self.user2.username]
            }
            response = self.client.post(url, data, format='json')
            self.assertEqual(url, '/api/realtimeapi/create_group/')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(Group.objects.count(), 2)
            

        def test_get_group_list(self):
            url = reverse('get_group_list', args=[self.user1.username])
            response = self.client.get(url, format='json')
            self.assertEqual(url, '/api/realtimeapi/get_group_list/testuser1/')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            groups = response.data.get('groups', [])
            self.assertTrue(groups)
            self.assertEqual(groups[0]['admin'], self.user1.username)
            self.assertEqual(groups[0]['name'], "testgroup")

        def test_save_group_message(self):
            url = reverse('save_group_message')
            data = {
                "group_id": self.group.id,
                "sender": self.user1.username,
                "group_name": self.group.name,
                "message": "Hello"}
            response = self.client.post(url, data, format='json')
            self.assertEqual(url, '/api/realtimeapi/group_message/')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(GroupMessage.objects.count(), 2)


class TestNewsFeed(TestRealTimeApiTest):
    
    def test_add_new_Post(self):
        url = reverse('add_new_Post')
        data = {
            "username": self.user1.username,
            "text": "Hello",
        }
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(url, '/api/realtimeapi/add_new_Post/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 2)

    def test_get_all_newsFeed(self):
        url = reverse('get_all_newsFeed')
        response = self.client.get(url, format='json')
        self.assertEqual(url, '/api/realtimeapi/get_all_newsFeed/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_post(self):
        url = reverse('delete_post', args=[self.post.id])
        response = self.client.delete(url, format='json')
        self.assertEqual(url, f'/api/realtimeapi/delete_post/{self.post.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_add_commnet(self):
        url = reverse('add_comment')
        data = {
            "post_id": self.post.id,
            "username": self.user1.username,
            "comment": "Hello"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(url, '/api/realtimeapi/add_comment/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 2)

    def test_get_Comment(self):
        url = reverse('get_Comment', args=[self.post.id])
        response = self.client.get(url, format='json')
        self.assertEqual(url, f'/api/realtimeapi/get_Comment/{self.post.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        comments = response.data
        self.assertTrue(comments)