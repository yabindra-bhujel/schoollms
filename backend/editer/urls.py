from django.urls import path

from .views import get_code,add_new_problem,get_all_problems,check_problem_complate
urlpatterns = [
    path('', get_code, name='get_code'),
    path('add_new_problem', add_new_problem, name='add_new_problem'),
    path('get_all_problems', get_all_problems, name='get_all_problems'),
    path('check_problem_complete/<int:user_id>/<int:problem_id>/', check_problem_complate, name='check_problem_complete'),

    
]
