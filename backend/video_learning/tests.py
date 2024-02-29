from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from.models import *
from tenant.models import UserProfile
User = get_user_model()

class BaseTestCase(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(username='user', password='pass')
        self.userProfile = UserProfile.objects.create(user=self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.video = Video.objects.create(user=self.user, title='title', description='description', video='videos/test.mp4')

    def tearDown(self):
        super().tearDown()
        self.user.delete()

class VideoTestCase(BaseTestCase):

    def test_add_video(self):
        url = reverse('addvideo')
        data = {'title': 'title', 'description': 'description', 'video': 'videos/test.mp4', 'user': self.user.id, 'thumbnail': 'thumbnails/test.jpg'}
        self.assertEqual(url, '/video_learning/addvideo/')
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Video.objects.count(), 2)

    def test_get_all_videos(self):
        url = reverse('video_learning')
        response = self.client.get(url)
        self.assertEqual(url, '/video_learning/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_video_details(self):
        url = reverse('video_details', args=[self.video.id])
        response = self.client.get(url)
        self.assertEqual(url, f'/video_learning/{self.video.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'title')

    def test_create_comment(self):
        url = reverse('addcomment')
        data = {'video_id': self.video.id, 'user': self.user.id, 'comment': 'comment'}
        self.assertEqual(url, '/video_learning/addcomment/')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)

    def test_create_like(self):
        url = reverse('addlike')
        data = {'video': self.video.id, 'user': self.user.id}
        self.assertEqual(url, '/video_learning/addlike/')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Like.objects.count(), 1)

    def test_search_video_data(self):
        url = reverse('search')
        data = {'search': 'title'}
        self.assertEqual(url, '/video_learning/search/')
        response = self.client.get(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'title')

class ArticleTestCase(BaseTestCase):
    
        def test_create_article(self):
            url = reverse('create_article', args=[self.user.username])
            data = {'title': 'title', 'description': 'content'}
            self.assertEqual(url, f'/video_learning/create_article/{self.user.username}/')
            response = self.client.post(url, data)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(Article.objects.count(), 1)
    
        def test_get_article_list(self):
            url = reverse('get_article_list')
            response = self.client.get(url)
            self.assertEqual(url, '/video_learning/get_article_list/')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(len(response.data), 0)
    
        def test_get_article_by_id(self):
            article = Article.objects.create(user=self.user, title='title', content='content')
            url = reverse('get_article_by_id', args=[article.id])
            response = self.client.get(url)
            self.assertEqual(url, f'/video_learning/get_article_by_id/{article.id}/')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['title'], 'title')