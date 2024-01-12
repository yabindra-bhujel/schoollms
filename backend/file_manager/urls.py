from django.urls import path
from.views import get_folders,create_folder,delete_folder,update_folder,folder_details,upload_files

urlpatterns = [
    path('upload_files/', upload_files, name="upload_files"),
    path('update_folder/<str:pk>/', update_folder, name="update_folder"),
    path('delete_folder/<str:pk>/', delete_folder, name="delete_folder"),
    path('<int:user_id>/', get_folders, name="get_folders"),
    path('create_folder/', create_folder, name="create_folder"),
    path('<str:folder_name>/', folder_details, name="folder_details"),

]


