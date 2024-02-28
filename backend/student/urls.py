from django. urls import path
from.views import *

urlpatterns = [
    path('list', student_list, name="student_list"),
    path('add_student_by_csv_file/', add_student_by_csv_file, name="add_student_by_csv_file"),
    path('get_student_today_class/', getStudentTodayClass, name="get_student_today_class"),
    path('add/', add_newStudent, name="add_newStudent"),
    path('<str:studentID>/', student_detail, name="student_detail"),
    path('delete_student/<str:studentID>/', delete_student, name="delete_student"),
    
    

]