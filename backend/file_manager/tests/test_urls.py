from django.test import SimpleTestCase
from django.urls import reverse, resolve
from file_manager.views import *


class TestUrls(SimpleTestCase):

    def test_file_upload_url_resolves(self):
        url = reverse('get_folders', args=[1])
        self.assertEqual(resolve(url).func, get_folders)

    def test_file_download_url_resolves(self):
        url = reverse('create_folder')
        self.assertEqual(resolve(url).func, create_folder)

    def test_file_delete_url_resolves(self):
        url = reverse('delete_folder', args=[1])
        self.assertEqual(resolve(url).func, delete_folder)

    def test_file_update_url_resolves(self):
        url = reverse('update_folder', args=[1])
        self.assertEqual(resolve(url).func, update_folder)
    
    def test_file_details_url_resolves(self):
        url = reverse('folder_details', args=['folder_name'])
        self.assertEqual(resolve(url).func, folder_details)

    def test_file_upload_url_resolves(self):
        url = reverse('upload_files')
        self.assertEqual(resolve(url).func, upload_files)
