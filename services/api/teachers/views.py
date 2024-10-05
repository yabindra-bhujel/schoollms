from django.shortcuts import get_object_or_404
from courses.subjects.models import Subject, SubjectRegistration
from .services.read_csv import ReadCSV
from .services.creaet_teacher import TeacherCreator
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
from .serializers import *
from .services.teacher_class import TeacherClassService
from datetime import datetime
from courses.subjects.models import Assignment
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.openapi import OpenApiTypes

class AdminTeacherViewSet(viewsets.ViewSet):
    serializer_class = TeacherSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = "id"

    @extend_schema(responses={200: TeacherSerializer})
    def list(self, request):
        queryset = Teacher.objects.all()
        serializer = TeacherSerializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the teacher",
            )
        ],
        responses={200: TeacherSerializer},
    )
    def retrieve(self, request, id: int = None):
        queryset = Teacher.objects.all()
        teacher = get_object_or_404(queryset, id=id)
        serializer = TeacherSerializer(teacher)
        return Response(serializer.data)

    @extend_schema(responses={201: TeacherSerializer})
    def create(self, request):
        teacher = TeacherCreator(request.data).create_teacher()
        if 'error' in teacher:
            return Response(teacher, status=status.HTTP_400_BAD_REQUEST)
        return Response(teacher, status=status.HTTP_201_CREATED)

    @extend_schema(responses={201: TeacherSerializer}, description='Add teacher from file in csv format. File should contain teacher_id, first_name, last_name, email, phone_number, date_of_birth, address, city, state, country')
    @action(detail=False, methods=['post'], url_path='add-teacher-from-file', url_name='add-teacher-from-file')
    def add_teacher_from_file(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file found'}, status=status.HTTP_400_BAD_REQUEST)
        data = ReadCSV(file).read()
        if 'error' in data:
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        for teacher in data:
            teacher = TeacherCreator(teacher).create_teacher()
            if 'error' in teacher:
                return Response(teacher, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Teachers added successfully'}, status=status.HTTP_201_CREATED)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the teacher",
            )
        ],
        responses={200: TeacherSerializer},
    )
    def update(self, request, id: int = None):
        queryset = Teacher.objects.all()
        teacher = get_object_or_404(queryset, id=id)
        serializer = TeacherSerializer(teacher, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the teacher",
            )

        ],
    )
    def destroy(self, request, id: int = None):
        queryset = Teacher.objects.all()
        teacher = get_object_or_404(queryset, id=id)
        teacher.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TeacherViewSet(viewsets.ViewSet):

    serializer_class = TeacherSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "id"
    
    @extend_schema(responses={200: dict})
    @action(detail=False, methods=['get'], url_path='teacher_today_class', url_name='today_class')
    def get_today_class(self, request):
        user = request.user

        if hasattr (user, 'is_teacher') and user.is_teacher:
            teacher = user.is_teacher

        current_day = datetime.now().strftime('%A')
        teacher_classes_today = SubjectRegistration.objects.filter(teacher=teacher, subject__weekday=current_day)

        subject_data = []

        for enrollment in teacher_classes_today:
            subject_data.append({
                "subject_code": enrollment.subject.subject_code,
                "subject_name": enrollment.subject.subject_name,
                "subject_description": enrollment.subject.subject_description,
                "weekday": enrollment.subject.weekday,
                "period_start_time": enrollment.subject.period_start_time,
                "period_end_time": enrollment.subject.period_end_time,
                "class_room": enrollment.subject.class_room,
                "class_period": enrollment.subject.class_period,
            })
        return Response(subject_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='teacher_class', url_name='teacher_class')
    def get_teacher_class(self, request):
        teacher_class_data = TeacherClassService().get_teacher_class(request.user.username)
        return Response(teacher_class_data)

    @action(detail=False, methods=['get'], url_path='stduent_list_byteacher', url_name='stduent_list_byteacher')
    def get_student_list_by_teacher(self, request):
        teacher = get_object_or_404(Teacher, user=request.user)
        subject_registration = SubjectRegistration.objects.filter(teacher=teacher)
        student_list = []
        for registration in subject_registration:
            students = registration.student.all()
            for student in students:
                student_list.append({
                    'student_id': student.student_id,
                    'first_name': student.first_name,
                    'last_name': student.last_name,
                    'email': student.email,
                    'gender': student.gender,
                    'phone': student.phone,
                    'date_of_birth': student.date_of_birth,
                })
        return Response(student_list, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='teacher/upcoming_assignment_deadlines', url_name='teacher_upcoming_assignment_deadlines')
    def upcoming_assignment_deadlines(self, request):
        try:
            teacher = Teacher.objects.get(user=request.user)

            subject_enrollments = SubjectRegistration.objects.filter(teacher=teacher)
            assignments = Assignment.objects.filter(course__in=subject_enrollments.values_list('subject', flat=True))

            upcoming_assignments = assignments.filter(deadline__gt=timezone.now(), is_active=True)

            assignments_data= []

            for assignment in upcoming_assignments:
                assignments_data.append({
                    "id": assignment.id,
                    "title": assignment.title,
                    "deadline": assignment.deadline,
                    "subject": assignment.course.subject_name,
                })

            return Response(assignments_data, status=200)
        except Exception as e:
            return Response({"message": "An error occurred"}, status=500)
