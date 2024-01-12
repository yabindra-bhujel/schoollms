from django.test import SimpleTestCase

from django.urls import reverse, resolve
from realtimeapi.views import *


class TestUrls(SimpleTestCase):


    def test_all_message_url(self):
        url = reverse('get_all_messages')
        self.assertEqual(resolve(url).func, all_messages)


    def test_update_message_status_url(self):
        url = reverse('update_message_status', args=['test', 'test'])
        self.assertEqual(resolve(url).func, update_message_status)

    def test_get_messge_basedonUser_url(self):
        url = reverse('get_all_messages', args=['test', 'test'])
        self.assertEqual(resolve(url).func, get_all_messages)


    
    def test_save_message_to_database_url(self):
        url = reverse('save_message_to_database')
        self.assertEqual(resolve(url).func, save_message_to_database)


    def test_get_allUser_url(self):
        url = reverse('get_all_user', args=['test'])
        self.assertEqual(resolve(url).func,get_all_user )


    def test_get_all_newsFeed_url(self):
        url = reverse('get_all_newsFeed')
        self.assertEqual(resolve(url).func, get_all_newsFeed)


    def test_get_comment_url(self):
        url = reverse('get_Comment', args=[1])
        self.assertEqual(resolve(url).func, get_Comment)

    def test_add_comment_url(self):
        url = reverse('add_comment')
        self.assertEqual(resolve(url).func, add_comment)

    def test_create_group_url(self):
        url = reverse('create_group')
        self.assertEqual(resolve(url).func, create_group)
    
    def test_get_grouplist_url(self):
        url = reverse('get_group_list', args=['test'])
        self.assertEqual(resolve(url).func, get_group_list)