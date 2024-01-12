from django.test import SimpleTestCase
from django.urls import reverse, resolve
from teacher.views import teacher_list, add_teacher, teacher_detail


class TestUrls(SimpleTestCase):
    
        def test_teacher_list_url_is_resolved(self):
            url = reverse('teacher_list')
            self.assertEqual(resolve(url).func, teacher_list)
    
        def test_add_teacher_url_is_resolved(self):
            url = reverse('create_teacher')
            self.assertEqual(resolve(url).func, add_teacher)
    
        def test_teacher_detail_url_is_resolved(self):
            url = reverse('teacher_detail', args=[1])
            self.assertEqual(resolve(url).func, teacher_detail)

  