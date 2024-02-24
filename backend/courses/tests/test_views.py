from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from courses.models import *

class EnrollSubjectTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.username = 'test_username'
        self.teacher = Teacher.objects.create(TeacherID='T123', first_name='John', last_name='Doe')
        self.student = Student.objects.create(studentID='S123', first_name='Jane', last_name='Smith')
        self.department = Department.objects.create(Department_name='Test Department')
        self.subject = Subject.objects.create(subject_code='CS101', subject_name='Computer Science', weekday='Monday', class_period=1, subject_faculty=self.department, subject_teacher=self.teacher)
    
    def test_create_enroll_subject(self):
        url = reverse('create_enroll_subject', args=[self.username])
        data = {
            'subject_name': 'Computer Science',
            'subject_teacher': 'John Doe',
            'student': ['S123']
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_subject_enroll(self):
        url = reverse('get_subject_enroll', args=[self.username])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class CourseManagementTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_create_course(self):
        url = reverse('create_course')
        data = {
            'course_id': 'CS101',
            'course_name': 'Computer Science',
            'weekday': 'Monday',
            'class_period': 1,
            'course_department': 'Test Department',
            'teacher_name': 'John Doe'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_course(self):
        teacher = Teacher.objects.create(TeacherID='T123', first_name='John', last_name='Doe')
        department = Department.objects.create(Department_name='Test Department')
        subject = Subject.objects.create(subject_code='CS101', subject_name='Computer Science', weekday='Monday', class_period=1, subject_faculty=department, subject_teacher=teacher)
        url = reverse('delete_course', args=[subject.subject_code, 'test_username'])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_department_list(self):
        url = reverse('department_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
