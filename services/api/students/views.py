from datetime import datetime
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
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .serializers import StudentSerializer
from .services.add_student import StudentCreator
from courses.subjects .models import *
from courses.subjects.serializers import AnnouncementSerializer, AssignmentSerializer
from django.utils import timezone
from drf_spectacular.openapi import OpenApiTypes
from typing import Optional


@extend_schema(tags=["Admin Student"])
class AdminStudentViewSet(viewsets.ViewSet):

    serializer_class = StudentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = "student_id"

    def list(self, request):
        queryset = Student.objects.all()
        serializer = StudentSerializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="student_id",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="ID of the student",
            )
        ],
        responses={200: StudentSerializer},
    )
    def retrieve(self, request, student_id: [Optional[str]] = None):
        queryset = Student.objects.all()
        student = get_object_or_404(queryset, student_id=student_id)
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

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="student_id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the student",
            )
        ],
        responses={200: StudentSerializer},
    )
    def update(self, request, student_id: Optional[int] = None):
        queryset = Student.objects.all()
        student = get_object_or_404(queryset, student_id=student_id)
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="student_id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the student",
            )
        ],
    )
    def destroy(self, request, student_id: int=None):
        queryset = Student.objects.all()
        student = get_object_or_404(queryset, student_id=student_id)
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(tags=["Student"])
class StudentViewSet(viewsets.ViewSet):
    serializer_class = StudentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    @extend_schema(responses={200: StudentSerializer}, description='Get Student today class')
    @action(detail=False, methods=['get'], url_path='today_class', url_name='today-_lass')
    def get_today_class(self, request):
        try:
            if request.user.is_student:
                student = request.user.student
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        current_day = datetime.now().strftime('%A') 

        student_classes_today = SubjectRegistration.objects.filter(student=student, subject__weekday=current_day)

        subjects_data = []
        for enrollment in student_classes_today:
            subject_data = {
                "subject_code": enrollment.subject.subject_code,
                "subject_name": enrollment.subject.subject_name,
                "subject_description": enrollment.subject.subject_description,
                "weekday": enrollment.subject.weekday,
                "period_start_time": enrollment.subject.period_start_time,
                "period_end_time": enrollment.subject.period_end_time,
                "class_room": enrollment.subject.class_room,
                "class_period": enrollment.subject.class_period,
            }
            subjects_data.append(subject_data)

        return Response(subjects_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='student_class', url_name='student_class')
    def student_class(self, request):
        student_class_data = StduentClassService().get_student_class_data(request.user.username)
        return Response(student_class_data)

    @extend_schema(responses={200: AnnouncementSerializer}, description='Get Student Announcement')
    @action(detail=False, methods=['get'], url_path='announcement', url_name='announcement')
    def announcement(self, request):
        try:
            student = Student.objects.get(user=request.user)
            subject_enroll = SubjectRegistration.objects.filter(student=student)
            announcement = Announcement.objects.filter(subject__in=subject_enroll.values_list('subject', flat=True))
            serializer = AnnouncementSerializer(announcement, many=True, context={'request': request})
            return Response(serializer.data, status=200)

        except Exception as e:
            return Response({"message": "An error occurred"}, status=500)

    @extend_schema(
        responses={200: AssignmentSerializer(many=True)},
        description='Get upcoming assignment deadlines'
    )
    @action(detail=False, methods=['get'], url_path='upcoming_or_recent_assignment_deadlines', url_name='upcoming_assignment_deadlines')
    def upcoming_or_recent_assignment_deadlines(self, request):
        try:
            student = Student.objects.get(user=request.user)

            subject_enrollments = SubjectRegistration.objects.filter(student=student)
            assignments = Assignment.objects.filter(course__in=subject_enrollments.values_list('subject', flat=True)).order_by('-deadline')[:10]

            assignments_data = []

            for assignment in assignments:
                is_complete: bool = False
                not_submitted: bool = False

                if assignment.assigment_type == Assignment.AssignmentType.TEXT:
                    is_complete = TextSubmission.objects.filter(student=student, assignment=assignment).exists()

                    # filter by student and only filter if deadline is passed
                    if assignment.deadline < timezone.now() and not is_complete:
                        not_submitted = True
                   

                if assignment.assigment_type == Assignment.AssignmentType.FILE:
                    is_complete = FileSubmission.objects.filter(
                        student=student, assignment=assignment
                    ).exists()

                    if assignment.deadline < timezone.now() and not is_complete:
                        not_submitted = True

                assignment_data = {
                    "id": assignment.id,
                    "title": assignment.title,
                    "deadline": assignment.deadline,
                    "subject": assignment.course.subject_name,
                    "subject_code": assignment.course.subject_code,
                    "is_complete": is_complete,
                    "not_submitted": not_submitted,
                }
                assignments_data.append(assignment_data)

            return Response(assignments_data, status=200)
        except Exception as e:
            print(e)
            return Response({"message": "An error occurred"}, status=500)
