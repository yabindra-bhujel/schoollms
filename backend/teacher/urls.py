from django.urls import path
from.views import *


urlpatterns = [
    path('add/file/', add_teacher_by_file, name="add_teacher_by_file"),
    path('delete/<str:TeacherID>/', delete_teacher, name="delete_teacher"),
    path('get_teacher_today_class/<int:teacher_id>/', get_teacher_today_class, name="get_teacher_today_class"),
    path('list/',teacher_list , name="teacher_list"),
    path('add/', add_teacher, name="create_teacher"),
    path('<str:TeacherID>/', teacher_detail, name="teacher_detail" ),
]