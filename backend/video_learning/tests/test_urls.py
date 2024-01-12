from django.test import SimpleTestCase

from django.urls import reverse, resolve
from video_learning.views import get_all_videos, video_details, create_comment, create_like, create_video

class TestUrls(SimpleTestCase):
    
    def test_get_all_videos_url_is_resolved(self):
        url = reverse('video_learning')
        self.assertEqual(resolve(url).func, get_all_videos)


    def test_video_details_url_is_resolved(self):
        url = reverse('video_details', args=[1])
        self.assertEqual(resolve(url).func, video_details)


    def test_create_comment_url_is_resolved(self):
        url = reverse('addcomment')
        self.assertEqual(resolve(url).func, create_comment)


    
    def test_create_like_url_is_resolved(self):
        url = reverse('addlike')
        self.assertEqual(resolve(url).func, create_like)


    def test_ccreate_video_url_is_resolved(self):
        url = reverse('addvideo')
        self.assertEqual(resolve(url).func, create_video)
    
    