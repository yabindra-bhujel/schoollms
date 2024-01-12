from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase
from django.contrib.auth import get_user_model
from video_learning.models import Video, Comment
from video_learning.views import create_video, get_all_videos,video_details,search_video_data,create_comment,create_like
from tenant.models import UserProfile

User = get_user_model()


class TestCreateVideo(APITestCase):
    databases = {'default'}  # Explicitly allow database access

    def setUp(self):
        self.factory = APIRequestFactory()
        self.create_video_url = reverse('addvideo')  
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
         # Create a UserProfile for the user
        self.user_profile = UserProfile.objects.create(user=self.user)

        # Create a Video object for the user
        self.video = Video.objects.create(
            user=self.user_profile.user,
            title="Test Video",
            description="Test description",
            video="Test video URL",
            thumbnail="Test thumbnail URL"
        )
        

    def test_create_video(self):
        # Log in the user
        self.client.login(username='testuser', password='testpassword')

        video_data = {
            "id":1,
            "user": self.user.id,
            "title": "Test Video",
            "description": "Test description",
            "video": "Test video URL",
            "thumbnail": "Test thumbnail URL"
        }

        # Create a POST request
        request = self.factory.post(self.create_video_url, video_data, format='json')

        request.user = self.user

        # Call  view function directly with the request
        response = create_video(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Video.objects.filter(title="Test Video").exists())


    # test for get all video
    def test_get_all_videos(self):
        self.client.login(username='testuser', password='testpassword')

        # Create a GET request to retrieve all videos
        request = self.factory.get('/video_learning/')  # Use the URL pattern you defined

        request.user = self.user

        response = get_all_videos(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_get_video_by_id(self):
        self.client.login(username='testuser', password='testpassword')
        video = Video.objects.create(
            id=1,
            user=self.user,
            title="Test Video",
            description="Test description",
            video="Test video URL",
            thumbnail="Test thumbnail URL"
        )

        request = self.factory.get('/video_learning/1')

        response = video_details(request, 1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_video(self):
        self.client.login(username='testuser', password='testpassword')
        video = Video.objects.create(
            id=1,
            user=self.user,
            title="Test Video",
            description="Test description",
            video="Test video URL",
            thumbnail="Test thumbnail URL"
        )
        request = self.factory.get('/video_learning/search/')
        request.user = self.user
        response = search_video_data(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_creaet_comment(self):
        self.client.login(username='testuser', password='testpassword')
        video = Video.objects.create(
            user=self.user,
            title="Test Video",
            description="Test description",
            video="Test video URL",
            thumbnail="Test thumbnail URL"
        )
        comment_data = {
            "video_id": video.id,
            "comment": "Test comment text",
            "user": self.user.id
        }
        request = self.factory.post('/video_learning/addcomment', comment_data, format='json')
        request.user = self.user
        response = create_comment(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_like(self):
        self.client.login(username='testuser', password='testpassword')
        video = Video.objects.create(
            user=self.user,
            title="Test Video",
            description="Test description",
            video="Test video URL",
            thumbnail="Test thumbnail URL"
        )
        like_data = {
            "video": video.id,
            "user": self.user.id
        }
        request = self.factory.post('addlike', like_data)
        request.user = self.user
        response = create_like(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

