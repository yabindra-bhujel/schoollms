from django.test import TestCase, RequestFactory
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from file_manager.views import *
from file_manager.models import *
from file_manager.views import *
from django.contrib.auth import get_user_model

User = get_user_model()


class FileManagerViewsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.factory = RequestFactory()



    def test_get_folders(self):
        # create a user object
        user = User.objects.create(
            username='test_user',
            password='test_password'
        )

        # create a folder object
        folder = Folder.objects.create(
            name='test_folder',
            user=user,

        )

        # create a file object
        file_obj = File.objects.create(
            folder=folder,
            size=1024,  # Assuming size is a required field in your File model
            user=user
        )

        # create a request object
        url = reverse('get_folders', args=[user.username])
        request = self.factory.get(url)

        # call the view function
        response = get_folders(request, user.username)

        # check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check the response content type
        self.assertEqual(response['Content-Type'], 'application/json')

        # check the response content
        expected_response = [
            {
                'id': folder.id,
                'name': folder.name,
                'user': user.id,
                'files': [
                    {
                        'id': file_obj.id,
                        'folder': folder.id,
                        'user': user.id,
                        'formatted_size': '1.00 KB',
                    }
                ]
            }
        ]
        self.assertEqual(response.json(), expected_response)

