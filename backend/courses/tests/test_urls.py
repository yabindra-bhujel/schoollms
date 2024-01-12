from django.test import SimpleTestCase
from django.urls import reverse, resolve
from courses.views import *
class TestsUrl(SimpleTestCase):

    def test_course_list_url_is_resolved(self):
        url = reverse('course')
        self.assertEquals(resolve(url).func, course_list)

    
    def test_course_details_url_is_resolved(self):
        url = reverse('course_details', args=["21"])
        self.assertEquals(resolve(url).func, course_details)


    def test_course_file_url_is_resolved(self):
        url = reverse('get_file')
        self.assertEquals(resolve(url).func, get_file)

    def test_course_assigment_detalis_urls_is_resolved(self):
        url = reverse('assigment_detalis', args=['2'])
        self.assertEquals(resolve(url).func, assignment_details)


    def test_course_department_list_is_resolved(self):
        url = reverse('department_list')
        self.assertEqual(resolve(url).func, department_list)



    def test_course_create_assigment_is_resolved(self):
        url = reverse('create_assigment')
        self.assertEquals(resolve(url).func, create_assigment)

    

    def test_course_file_assigment_is_resolved(self):
        url = reverse('file_assigment')
        self.assertEquals(resolve(url).func, file_assigment)


    def test_course_text_assigment_is_resolved(self):
        url = reverse('text_assigment')
        self.assertEquals(resolve(url).func, text_assignment)


    def test_student_assignment_details_resolved(self):
        url = reverse('student_assignment_details', args=['2'])
        self.assertEquals(resolve(url).func, student_assignment_details)
        
    def test_all_assigemnt_list_url(self):
        url = reverse('get_all_assignment', args=['2'])
        self.assertEquals(resolve(url).func, get_all_assignment)
    
    def test_active_assigemnt_list_url(self):
        url = reverse('get_active_assigemnt', args=['2'])
        self.assertEquals(resolve(url).func, get_active_assigemnt)

    def test_past_assigemnt_list_url(self):
        url = reverse('get_past_assigemnt', args=['2'])
        self.assertEquals(resolve(url).func, get_past_assigemnt)

    def test_future_assigemnt_list_url(self):
        url = reverse('get_future_assigemnt', args=['2'])
        self.assertEquals(resolve(url).func, get_future_assigemnt)


    def test_create_attendance_url_is_resolved(self):
        url = reverse('create_attendance')
        self.assertEquals(resolve(url).func, create_attendance)

    def test_mark_attendance_url_is_resolved(self):
        url = reverse('mark_attendance')
        self.assertEquals(resolve(url).func, mark_attendance)

