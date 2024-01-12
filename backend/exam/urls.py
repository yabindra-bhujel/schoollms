from django.urls import path
from .views import ExamDetailView, ExamView,get_exam_list_by_student,save_exam_data,updateExam

urlpatterns = [
    path('update/<int:id>/', updateExam, name='update_exam'),
    path('save_exam_data/', save_exam_data, name='save_exam_data'),
    path('get_exam_list_by_student/<int:student_id>/', get_exam_list_by_student, name='get_exam_list_by_student'),
    path('<int:id>/',ExamView.as_view(), name='get_exam_list_for_by_subject'),
    path('create/', ExamView.as_view(), name='create_exam'),
    path('details/<int:exam_id>/', ExamDetailView.as_view(), name='get_exam_by_id'),
]
