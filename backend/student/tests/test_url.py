from django.urls import resolve,reverse
from django.test import SimpleTestCase
from student.views import student_list, student_detail, add_newStudent



class TestUrl(SimpleTestCase):

    def test_add_studet_url(self):
        url = reverse('add_newStudent')
        self.assertEqual(resolve(url).func, add_newStudent)


    def test_student_list_url(self):
        url = reverse('student_list')
        self.assertEqual(resolve(url).func, student_list)


    def test_student_detils_url(self):
        url = reverse('student_detail', args=[1])
        self.assertEqual(resolve(url).func, student_detail)
