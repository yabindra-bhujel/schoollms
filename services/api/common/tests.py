from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()

class TestAPICalendar(APITestCase):

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(username='normal', password='pass')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_create_calendar(self):

        url = '/api/calendar/'

        data = {
            'title': 'Test',
            'start_date': '2021-09-01',
            'end_date': '2021-09-01',
            'color': 'red',
            'start_time': '10:00:00',
            'end_time': '12:00:00',
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Test')
        self.assertEqual(response.data['start_date'], '2021-09-01')
        self.assertEqual(response.data['end_date'], '2021-09-01')
        self.assertEqual(response.data['color'], 'red')
        self.assertEqual(response.data['start_time'], '10:00:00')


        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actual_data = response.data
        id = actual_data[0]['id']
        self.assertEqual(len(actual_data), 1)
        self.assertEqual(actual_data[0]['title'], 'Test')
        self.assertEqual(actual_data[0]['start_date'], '2021-09-01')
        self.assertEqual(actual_data[0]['end_date'], '2021-09-01')
        self.assertEqual(actual_data[0]['color'], 'red')

        url = f'/api/calendar/{id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test')
        self.assertEqual(response.data['start_date'], '2021-09-01')
        self.assertEqual(response.data['end_date'], '2021-09-01')
        self.assertEqual(response.data['color'], 'red')
        
        response = self.client.put(url, {'title': 'Test2', 'start_date': '2021-09-02', 'end_date': '2021-09-02', 'color': 'blue', 'start_time': '10:00:00', 'end_time': '12:00:00'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test2')
        self.assertEqual(response.data['start_date'], '2021-09-02')
        self.assertEqual(response.data['end_date'], '2021-09-02')
        self.assertEqual(response.data['color'], 'blue')
        self.assertEqual(response.data['start_time'], '10:00:00')

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class TestAPINotes(APITestCase):

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(username='normal', password='pass')
        self.second_user = User.objects.create_user(username='normal2', password='pass')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_create_notes(self):

        url = '/api/notes/'

        data = {
            'title': 'Test',
            'content': 'Test content',
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Test')
        self.assertEqual(response.data['content'], 'Test content')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actual_data = response.data
        id = actual_data[0]['id']
        self.assertEqual(len(actual_data), 1)
        self.assertEqual(actual_data[0]['title'], 'Test')
        self.assertEqual(actual_data[0]['content'], 'Test content')
        self.assertEqual(actual_data[0]['note_type'], 'private')

        url = f'/api/notes/{id}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test')
        self.assertEqual(response.data['content'], 'Test content')

        
        response = self.client.put(url, {'title': 'Test2', 'content': 'Test content 2'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test2')
        self.assertEqual(response.data['content'], 'Test content 2')

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)