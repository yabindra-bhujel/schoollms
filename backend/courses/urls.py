from django.urls import path

from.views import *

urlpatterns = [
    path('get_announcement_by_student/<int:studentid>/', get_announcement_by_student, name='get_announcement_by_student'),
    path('update_announcement/<int:id>/', update_announcement, name='update_announcement'),
    path('delete_announcement/<int:id>/', delete_announcement, name='delete_announcement'),
    path('handle_active_change_announcement/<int:id>/', handle_active_change_announcement, name='handle_active_change_announcement'),
    path('get_announcement_by_subject/<int:subject_code>/', get_announcement_by_subject, name='get_announcement_by_subject'),
    path('get_announcement_by_subject_student/<int:subject_code>/', get_announcement_by_subject_student, name='get_announcement_by_subject_student'),
    path('AddAnnouncement/', AddAnnouncement, name='AddAnnouncement'),
    path('delete_file/<int:id>/', delete_file, name='delete_file'),
    path('get_attendance_by_student_subject/<int:studentID>/<int:subjectID>/', get_attendance_by_student_subject, name='get_attendance_by_student_subject'),
    path('update_submission/', update_submission, name='update_submission'),
    path('delete_assigemnt_question/<int:id>/', delete_assigemnt_question, name='delete_assigemnt_question'),
    path('upadteAssigemnt/', upadteAssigemnt, name='upadteAssigemnt'),
    path('get_attendance_by_student/<int:student_id>/', get_attendance_by_student, name='get_attendance_by_student'),
    path('get_student_list_by_subject_id/<int:subject_code>/', get_student_list_by_subject_id, name='get_student_list_by_subject_id'),
    path('create_attdenace_and_add_student/', create_attdenace_and_add_student, name='create_attdenace_and_add_student'),
    path('get_attendance_by_subject/<int:subject_code>/', get_attendance_by_subject, name='get_attendance_by_subject'),
    path('create_attendance/', create_attendance, name='create_attendance'),
    path('mark_attendance/', mark_attendance, name='mark_attendance'),
    path('department_list/', department_list, name='department_list'), 
    path('file_assigment/', file_assigment, name='file_assigment'), 
    path('text_assignment/', text_assignment, name='text_assigment'),
    path('',course_list ,name='course'), 
    path('create_assigment/', create_assigment, name='create_assigment'),
    path('assigment_detalis/<int:id>/', assignment_details, name='assigment_detalis'),
    path('student_assignment_details/<int:id>/', student_assignment_details, name='student_assignment_details'),
    path('get_file/', get_file, name='get_file'),
    path('<str:subject_code>/<int:studentID>/', course_details_student, name='course_details_student'),
    path('<str:subject_code>/', course_details, name='course_details'),
    path('get_all_assignment/<str:username>/', get_all_assignment, name='get_all_assignment'), 
    path('get_active_assigemnt/<str:username>/', get_active_assigemnt, name='get_active_assigemnt'), 
    path('get_past_assigemnt/<str:username>/', get_past_assigemnt, name='get_past_assigemnt'), 
    path('get_future_assigemnt/<str:username>/', get_future_assigemnt, name='get_future_assigemnt'),
]

