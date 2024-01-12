from file_manager.models import Folder, File, FileUpload
from .serializer import FolderSerializer, FileSerializer, FileUploadSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist

User = get_user_model()


def format_file_size(bytes):
    if bytes < 1024:
        return f"{bytes} bytes"
    elif bytes < 1024 * 1024:
        return f"{bytes / 1024:.2f} KB"
    elif bytes < 1024 * 1024 * 1024:
        return f"{bytes / (1024 * 1024):.2f} MB"
    else:
        return f"{bytes / (1024 * 1024 * 1024):.2f} GB"




@api_view(['GET'])
def get_folders(request, user_id):
    try:
        user = get_object_or_404(User, username=user_id)
        folders = Folder.objects.filter(user=user)
        serialized_folders = []

        for folder in folders:
            folder_serializer = FolderSerializer(folder, many=False)
            folder_data = folder_serializer.data

            # Retrieve files associated with the folder
            files = File.objects.filter(folder=folder, user=user)

            # Initialize file_data
            file_data = None

            # Serialize file data for each file
            serialized_files = []
            for file in files:
                file_serializer = FileSerializer(file, many=False)
                file_data = file_serializer.data

                # Serialize file_content using FileUploadSerializer
                file_content_data = FileUploadSerializer(file.file_content.all(), many=True).data
                file_data['file_content'] = file_content_data

                # Calculate and format file size using the format_file_size function
                file_size_bytes = file.size
                formatted_file_size = format_file_size(file_size_bytes)
                file_data['formatted_size'] = formatted_file_size

                # Construct the full URL for the pdf_file using request.build_absolute_uri
                if file_data['file_content']:
                    file_data['file'] = request.build_absolute_uri(file_data['file_content'][0]['file'])
                else:
                    file_data['pdf_file'] = None

                # Remove the file_content field
                del file_data['file_content']

                serialized_files.append(file_data)

            folder_data['files'] = serialized_files
            serialized_folders.append(folder_data)

        return Response(serialized_folders)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
def create_folder(request):
    print(request.data)
    try:
        user_id = request.data["user"]
        if user_id is None:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        user = User.objects.get(id = user_id)
        folder = Folder.objects.create(name=request.data['name'], user = user)
        serializer = FolderSerializer(folder, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print(e)
        return Response({"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['DELETE'])
def delete_folder(request, pk):
    try:
        folder = Folder.objects.get(id=pk)
        folder.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PUT'])
def update_folder(request, pk):
    try:
        folder = Folder.objects.get(id=pk)
        folder.name = request.data['name']
        folder.save()
        serializer = FolderSerializer(folder, many=False)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def folder_details(request, folder_name):
    try:
        folder = Folder.objects.get(name=folder_name)
        folder_serializer = FolderSerializer(folder, many=False)

        # Use filter to retrieve files associated with the folder
        files = File.objects.filter(folder=folder)

        # Serialize file_content for each file
        serialized_files = []
        for file in files:
            file_serializer = FileSerializer(file, many=False)
            file_data = file_serializer.data

            # Serialize file_content using FileUploadSerializer
            file_content_data = FileUploadSerializer(file.file_content.all(), many=True).data
            file_data['file_content'] = file_content_data

            # Calculate and format file size using the format_file_size function
            file_size_bytes = file.size
            formatted_file_size = format_file_size(file_size_bytes)
            file_data['formatted_size'] = formatted_file_size

            serialized_files.append(file_data)

        folder_data = folder_serializer.data
        folder_data['files'] = serialized_files

        return Response(folder_data)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def upload_files(request):
    try:
        # Extract data from the request
        upload_files = request.FILES.getlist("file")
        file_size = request.data["filesize"]
        folder_name = request.data["folder"]
        user_id = request.data["user_id"]

        # Check if folder and user exist
        try:
            folder = get_object_or_404(Folder, name=folder_name)
            user = get_object_or_404(User, id=user_id)
        except ObjectDoesNotExist as e:
            print(e)
            return Response({"message": "Object not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create a new file and associate it with the folder and user
        try:
            file = File.objects.create(folder=folder, user=user, size=file_size)
        except Exception as e:
            print(e)
            return Response({"message": "File creation failed"}, status=status.HTTP_400_BAD_REQUEST)

        # Create file upload objects for each uploaded file and associate them with the file
        for upload_file in upload_files:
            file_content = FileUpload(file=upload_file)
            file_content.save()
            file.file_content.add(file_content)

        return Response(status=status.HTTP_201_CREATED)

    except Exception as e:
        print(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)
