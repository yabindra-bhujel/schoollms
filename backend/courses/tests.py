from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from.models import *
from tenant.models import UserProfile
from teacher.models import Teacher
from student.models import Student
User = get_user_model()

class BaseTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword', is_teacher=True, is_staff=True, is_superuser=True)
        self.user_profile = UserProfile.objects.create(user=self.user)
        self.client.force_authenticate(user=self.user)
        self.department = Department.objects.create(Department_name='d Department', Department_code='fD')
        self.teacher = Teacher.objects.create(
            TeacherID=34234,
            first_name='John',
            last_name='Doe',
            gender='Male',
            email='teacher@example.com',
            phone='1234567890',
            address='123 Street, City',
            date_of_birth='2000-01-01',
            image=None)
        self.student = Student.objects.create(
            studentID=34234,
            first_name='John',
            last_name='Doe',
            gender='Male',
            date_of_birth='2000-01-01',
            email = 'studnet@gmail.com',
            phone = '1234567890',
            department = self.department,
            image=None)
        self.course = Subject.objects.create(subject_name='c Course', subject_code=201, subject_faculty=self.department, subject_teacher=self.teacher, weekday = 'Monday', period_start_time = '9:00', period_end_time = '10:30', class_room = 'U101', class_period = '1')
        self.subject_enroll = SubjectEnroll.objects.create(course=self.course, teacher=self.teacher)
        self.syllabus = Syllabus.objects.create(course=self.course)
        self.announcement = Announcement.objects.create(course=self.course, announcement_title='Test Announcement', announcement_description='Test Announcement Description')

    def tearDown(self):
        super().tearDown()
        self.user.delete()


   

class TestDepartment(BaseTest):
    def test_add_department(self):
        url = reverse('add_department', args=[self.user.username])
        data = {
            'Department_name': 'Test Department',
            'Department_code': 'TD'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(url, f'/course/add_department/{self.user.username}/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_department_list(self):
        url = reverse('department_list')
        response = self.client.get(url)
        self.assertEqual(url, '/course/department_list/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_department(self):
        url = reverse('update_department', args=[self.user.username, self.department.id])
        data = {
            'Department_name': 'Test Department Updated',
            'Department_code': 'TDU'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(url, f'/course/update_department/{self.user.username}/{self.department.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Department.objects.get().Department_name, 'Test Department Updated')
        self.assertEqual(Department.objects.get().Department_code, 'TDU')

class TestCourse(BaseTest):
    def test_creaet_course(self):
        url = reverse('create_course')
        data = {
            'course_id': '101',
            'course_name': 'Test Course',
            'weekday': 'TC',
            'course_department': self.department.Department_name,
            'teacher_name': f' {self.teacher.first_name} {self.teacher.last_name} {self.teacher.TeacherID}',
            'weekday': 'Monday',
            'period_start_time': '9:00',
            'period_end_time': '10:30',
            'class_room': 'U101',
            'class_period': '1'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(url, '/course/create_course/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_admincourse_list(self):
        url = reverse('admincourse_list')
        response = self.client.get(url)
        self.assertEqual(url, '/course/admin/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_course_details(self):
        url = reverse('course_details', args=[self.course.subject_code])
        response = self.client.get(url)
        self.assertEqual(url, f'/course/{self.course.subject_code}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_course(self):
        url = reverse('update_course', args=[self.course.subject_code])
        data = {
            'course_id': self.course.subject_name,
            'subject_name': 'Test Course Updated',
            'weekday': 'Monday',
            'period_start_time': '9:00',
            'period_end_time': '10:30',
            'class_room': 'U101',
            'class_period': '1'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(url, f'/course/update_course/{self.course.subject_code}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Subject.objects.get().subject_name, 'Test Course Updated')

    def test_admin_coursedetails(self):
        url = reverse('getCourseDetails', args=[self.course.subject_code])
        response = self.client.get(url)
        self.assertEqual(url, f'/course/get_course_details/{self.course.subject_code}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_course(self):
        url = reverse('delete_course', args=[self.course.subject_code, self.user.username])
        response = self.client.delete(url)
        self.assertEqual(url, f'/course/delete_course/{self.course.subject_code}/{self.user.username}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TestEnrollSubject(BaseTest):
    def test_create_enroll_subject(self):
        pass

    def test_get_subject_enroll(self):
        url = reverse('get_subject_enroll', args=[self.user.username])
        response = self.client.get(url)
        self.assertEqual(url, f'/course/get_subject_enroll/{self.user.username}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestSyllabus(BaseTest):
    def test_create_syllabus(self):
        url = reverse('createSyllabus', args=[self.course.subject_code])
        data = [
        {
            'section_title': 'Test Syllabus 1',
            'section_description': 'Test Syllabus 1'
        },
        {
            'section_title': 'Test Syllabus 2',
            'section_description': 'Test Syllabus 2'
        },
        {
            'section_title': 'Test Syllabus 3',
            'section_description': 'Test Syllabus 3'}]

        response = self.client.post(url, data, format='json')
        self.assertEqual(url, f'/course/create_syllabus/{self.course.subject_code}/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Syllabus.objects.count(), 1)


    def test_get_syllabus(self):
        url = reverse('syllabus', args=[self.course.subject_code])
        response = self.client.get(url)
        self.assertEqual(url, f'/course/syllabus/{self.course.subject_code}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestAnnouncement(BaseTest):
    def test_add_announcement(self):
        url = reverse('AddAnnouncement')
        data = {
            'subject_code': self.course.subject_code,
            'title': 'Test Announcement',
            'content': 'Test Announcement Description'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(url, '/course/AddAnnouncement/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Announcement.objects.count(), 2)

    
    def test_get_announcement_by_subject_student(self):
        url = reverse('get_announcement_by_subject_student', args=[self.course.subject_code])
        response = self.client.get(url)
        self.assertEqual(url, f'/course/get_announcement_by_subject_student/{self.course.subject_code}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def tets_handle_active_change_announcement(self):
        url = reverse('handle_active_change_announcement', args=[self.announcement.id])
        response = self.client.get(url)
        self.assertEqual(url, f'/course/handle_active_change_announcement/{self.announcement.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_announcement(self):
        url = reverse('delete_announcement', args=[self.announcement.id])
        response = self.client.delete(url)
        self.assertEqual(url, f'/course/delete_announcement/{self.announcement.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_update_announcement(self):
        url = reverse('update_announcement', args=[self.announcement.id])
        data = {
            'announcement_title': 'Test Announcement Updated',
            'announcement_description': 'Test Announcement Description Updated'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(url, f'/course/update_announcement/{self.announcement.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Announcement.objects.get().announcement_title, 'Test Announcement Updated')
        self.assertEqual(Announcement.objects.get().announcement_description, 'Test Announcement Description Updated')
   
class TestAttendance(BaseTest):
    def test_create_attendance(self):
        url = reverse('create_attendance')
        data = {
            'course_code': self.course.subject_code,
            'teacher_id': self.teacher.TeacherID,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(url, '/course/create_attendance/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Attendance.objects.count(), 1)

    def test_get_attendance_by_subject(self):
        url = reverse('get_attendance_by_subject', args=[self.course.subject_code])
        response = self.client.get(url)
        self.assertEqual(url, f'/course/get_attendance_by_subject/{self.course.subject_code}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_attendance_by_student_subject(self):
        url = reverse('get_attendance_by_student_subject', args=[self.student.studentID, self.course.subject_code])
        response = self.client.get(url)
        self.assertEqual(url, f'/course/get_attendance_by_student_subject/{self.student.studentID}/{self.course.subject_code}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
