from django.test import SimpleTestCase
from django.urls import reverse, resolve
from courses.views import *

class TestUrls(SimpleTestCase):
    def test_create_enroll_subject_url_resolves(self):
        url = reverse('create_enroll_subject', args=['test_username'])
        self.assertEqual(resolve(url).func, createEnrollSubject)

    def test_get_subject_enroll_url_resolves(self):
        url = reverse('get_subject_enroll', args=['test_username'])
        self.assertEqual(resolve(url).func, getSubjectEnroll)

    def test_create_course_url_resolves(self):
        url = reverse('create_course')
        self.assertEqual(resolve(url).func, createCourse)

    def test_delete_course_url_resolves(self):
        url = reverse('delete_course', args=['1', 'test_username'])
        self.assertEqual(resolve(url).func, deleteCourse)

    def test_delete_department_url_resolves(self):
        url = reverse('delete_department', args=['1', 'test_username'])
        self.assertEqual(resolve(url).func, deleteDepartment)

    def test_add_department_url_resolves(self):
        url = reverse('add_department', args=['test_username'])
        self.assertEqual(resolve(url).func, addDepartment)

    def test_update_department_url_resolves(self):
        url = reverse('update_department', args=['test_username', '1'])
        self.assertEqual(resolve(url).func, updateDepartment)

    def test_get_announcement_by_student_url_resolves(self):
        url = reverse('get_announcement_by_student')
        self.assertEqual(resolve(url).func, getAnnouncementByStudent)


    def test_get_announcement_by_subject_student(self):
        url = reverse('get_announcement_by_subject_student', args=['1'])
        self.assertEqual(resolve(url).func, getAnnouncementBySubjectStudent)

    def test_AddAnnouncement_url_resolves(self):
        url = reverse('AddAnnouncement')
        self.assertEqual(resolve(url).func, addAnnouncement)

    def test_delete_file_url_resolves(self):
        url = reverse('delete_file', args=[1])
        self.assertEqual(resolve(url).func, deleteFile)

    def test_get_attendance_by_student_subject_url_resolves(self):
        url = reverse('get_attendance_by_student_subject', args=[1, 1])
        self.assertEqual(resolve(url).func, getAttendanceByStudentSubject)

    def test_update_submission_url_resolves(self):
        url = reverse('update_submission')
        self.assertEqual(resolve(url).func, updateSubmission)

    def test_delete_assigemnt_question_url_resolves(self):
        url = reverse('delete_assigemnt_question', args=[1])
        self.assertEqual(resolve(url).func, deleteAssigemntQuestion)

    def test_upadteAssigemnt_url_resolves(self):
        url = reverse('upadteAssigemnt')
        self.assertEqual(resolve(url).func, upadteAssigemnt)

    def test_get_attendance_by_student_url_resolves(self):
        url = reverse('get_attendance_by_student', args=[1])
        self.assertEqual(resolve(url).func, getAttendanceByStudent)

    def test_get_student_list_by_subject_id_url_resolves(self):
        url = reverse('get_student_list_by_subject_id', args=[1])
        self.assertEqual(resolve(url).func, getStudentListBySubjectId)

    def test_create_attdenace_and_add_student_url_resolves(self):
        url = reverse('create_attdenace_and_add_student')
        self.assertEqual(resolve(url).func, createAttdenaceAndAddStudent)

    def test_get_attendance_by_subject_url_resolves(self):
        url = reverse('get_attendance_by_subject', args=[1])
        self.assertEqual(resolve(url).func, getAttendanceBySubject)

    def test_create_attendance_url_resolves(self):
        url = reverse('create_attendance')
        self.assertEqual(resolve(url).func, createAttendance)

    def test_mark_attendance_url_resolves(self):
        url = reverse('mark_attendance')
        self.assertEqual(resolve(url).func, markAttendance)

    def test_department_list_url_resolves(self):
        url = reverse('department_list')
        self.assertEqual(resolve(url).func, departmentList)

    def test_file_assigment_url_resolves(self):
        url = reverse('file_assigment')
        self.assertEqual(resolve(url).func, fileAssigment)

    def test_text_assignment_url_resolves(self):
        url = reverse('text_assigment')
        self.assertEqual(resolve(url).func, textAssignment)

    def test_admincourse_list_url_resolves(self):
        url = reverse('admincourse_list')
        self.assertEqual(resolve(url).func, admincourseList)

    def test_create_assigment_url_resolves(self):
        url = reverse('create_assigment')
        self.assertEqual(resolve(url).func, createAssigment)

    def test_assigment_detalis_url_resolves(self):
        url = reverse('assigment_detalis', args=[1])
        self.assertEqual(resolve(url).func, assignmentDetails)

    def test_student_assignment_details_url_resolves(self):
        url = reverse('student_assignment_details', args=[1])
        self.assertEqual(resolve(url).func, studentAssignmentDetails)

    def test_get_file_url_resolves(self):
        url = reverse('get_file')
        self.assertEqual(resolve(url).func, getFile)

    def test_course_details_student_url_resolves(self):
        url = reverse('course_details_student', args=['test_subject_code', 1])
        self.assertEqual(resolve(url).func, courseDetailsStudent)

    def test_course_details_url_resolves(self):
        url = reverse('course_details', args=['test_subject_code'])
        self.assertEqual(resolve(url).func, courseDetails)

    def test_get_all_assignment_url_resolves(self):
        url = reverse('get_all_assignment', args=['test_username'])
        self.assertEqual(resolve(url).func, getAllAssignment)

    def test_get_active_assigemnt_url_resolves(self):
        url = reverse('get_active_assigemnt', args=['test_username'])
        self.assertEqual(resolve(url).func, getActiveAssigemnt)

    def test_get_past_assigemnt_url_resolves(self):
        url = reverse('get_past_assigemnt', args=['test_username'])
        self.assertEqual(resolve(url).func, getPastAssigemnt)

    def test_get_future_assigemnt_url_resolves(self):
        url = reverse('get_future_assigemnt', args=['test_username'])
        self.assertEqual(resolve(url).func, getFutureAssigemnt)