from django.test import TestCase
from video_learning.models import Video, Comment, Like
from django.contrib.auth import get_user_model

User = get_user_model()



class TestModel(TestCase):
    def setUp(self):
        self.user =  User.objects.create(
            username='testuser',
            password='testpassword'
        )

        self.video = Video.objects.create(
            user = self.user,
            title='Test Video',
            description='Test description',
            video='Test video URL',
            thumbnail='Test thumbnail URL'
        )

        self.comment = Comment.objects.create(
            video=self.video,
            user=self.user,
            comment='Test comment'
        )

        self.like = Like.objects.create(
            video=self.video,
            user=self.user,
            like=True
        )

    def test_video_model(self):
        # Retrieve the Video instance from the database
        video = Video.objects.get(id=self.video.id)

        # Verify the attributes of the Video model
        self.assertEqual(video.title, 'Test Video')
        self.assertEqual(video.description, 'Test description')
        self.assertEqual(video.video, 'Test video URL')
        self.assertEqual(video.thumbnail, 'Test thumbnail URL')
        self.assertEqual(video.user, self.user)

        # Verify that the Video model was successfully saved to the database
        self.assertTrue(Video.objects.filter(title='Test Video').exists())

    def test_comment_model(self):
        # Retrieve the Comment instance from the database
        comment = Comment.objects.get(id=self.comment.id)

        # Verify the attributes of the Comment model
        self.assertEqual(comment.video, self.video)
        self.assertEqual(comment.user, self.user)
        self.assertEqual(comment.comment, 'Test comment')

        # Verify that the Comment model was successfully saved to the database
        self.assertTrue(Comment.objects.filter(comment='Test comment').exists())


    def test_like_model(self):
        # Retrieve the Like instance from the database
        like = Like.objects.get(id=self.like.id)

        # Verify the attributes of the Like model
        self.assertEqual(like.video, self.video)
        self.assertEqual(like.user, self.user)
        self.assertEqual(like.like, True)

        # Verify that the Like model was successfully saved to the database
        self.assertTrue(Like.objects.filter(like=True).exists())
        