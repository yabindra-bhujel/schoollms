from django.shortcuts import get_object_or_404

from .services.student_class import StduentClassService
from .services.student_detail import StudentDetailService
from .services.read_csv import ReadCSV
from .models import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
User = get_user_model()
from rest_framework import viewsets
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from .serializers import StudentSerializer
from .services.add_student import StudentCreator

class AdminStudentViewSet(viewsets.ViewSet):
    serializer_class = StudentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(responses={200: StudentSerializer})
    def list(self, request):
        queryset = Student.objects.all()
        serializer = StudentSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @extend_schema(responses={200: StudentSerializer})
    def retrieve(self, request, pk=None):
        queryset = Student.objects.all()
        student = get_object_or_404(queryset, pk=pk)
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    
    @extend_schema(responses={201: StudentSerializer})
    def create(self, request):
        student = StudentCreator(request.data).create_student()
        if 'error' in student:
            return Response(student, status=status.HTTP_400_BAD_REQUEST)
        return Response(student, status=status.HTTP_201_CREATED)
    
    @extend_schema(responses={201: StudentSerializer}, description='Add student from file in csv format. File should contain student_id, first_name, last_name, email, phone_number, date_of_birth, address, city, state, country')
    @action(detail=False, methods=['post'], url_path='add-student-from-file', url_name='add-student-from-file')
    def add_student_from_file(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file found'}, status=status.HTTP_400_BAD_REQUEST)
        data = ReadCSV(file).read()
        if 'error' in data:
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        for student in data:
            student = StudentCreator(student).create_student()
            if 'error' in student:
                return Response(student, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Students added successfully'}, status=status.HTTP_201_CREATED)
    
    
    @extend_schema(responses={200: StudentSerializer})
    def update(self, request, pk=None):
        queryset = Student.objects.all()
        student = get_object_or_404(queryset, pk=pk)
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(responses={204: None})
    def destroy(self, request, pk=None):
        queryset = Student.objects.all()
        student = get_object_or_404(queryset, pk=pk)
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class StudentViewSet(viewsets.ViewSet):
    serializer_class = StudentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: StudentSerializer}, description='Get Student today class')
    @action(detail=False, methods=['get'], url_path='today_class', url_name='today-_lass')
    def get_today_class(self, request):
        queryset = Student.objects.all()
        student = get_object_or_404(queryset)
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    
    
    @extend_schema(responses={200}, description='Get Student class')
    @action(detail=False, methods=['get'], url_path='student_class', url_name='student_class')
    def student_class(self, request):
        student_class_data = StduentClassService().get_student_class_data(request.user.username)
        return Response(student_class_data)
    
    

