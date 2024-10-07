from datetime import datetime
from django.shortcuts import get_object_or_404
from .models import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
User = get_user_model()
from rest_framework import viewsets
from rest_framework.decorators import action
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
import logging
from teachers.models import Teacher
from students.models import Student
from courses.serializers import AttendanceSerializer
from ..subjects.models import Subject, SubjectRegistration
from courses.subjects.serializers import SubjectRegistrationSerializer, SubjectSerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.openapi import OpenApiTypes
from .services import AttendanceService
from typing import Dict, Any
from rest_framework.request import Request


logger = logging.getLogger(__name__)
@extend_schema(tags=["Attendance"])
class AttendanceViewSet(viewsets.ViewSet):
    serializer_class = AttendanceSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    attendance_service = AttendanceService()

    @extend_schema(responses={201: AttendanceSerializer})
    @action(detail=False, methods=['post'], url_path='create_attendance', url_name='create_attendance')
    def create_attendance(self, request):
        try:
            course_code = request.data.get("course_code")
            teacher_id = request.data.get("teacher_id")

            try:
                subject = Subject.objects.get(subject_code=course_code)
                teacher = Teacher.objects.get(teacher_id=teacher_id)
                subject_enroll_instance = subject.subjectregistration_set.first()
            except ObjectDoesNotExist as e:
                logger.error("Course or teacher not found")
                return Response({"message": "Course or teacher not found"}, status=404)

            try:
                attendance = Attendance.objects.create(course=subject, subject_enroll=subject_enroll_instance)
                attendance.save()
            except Exception as e:
                logger.error("An error occurred")
                return Response({"message": "An error occurred"}, status=500)

            attendance_serializer = AttendanceSerializer(attendance)
            response_data = attendance_serializer.data.copy()

            students_attended_ids = response_data.get("students_attended", [])

            students_attended = []
            for student_attended_id in students_attended_ids:
                try:
                    student_attended = StudentAttended.objects.get(id=student_attended_id)
                    student_attended_data = {
                        "student_id": student_attended.student.student_id,
                        "student_name": f"{student_attended.student.first_name} {student_attended.student.last_name}",
                        "is_present": student_attended.is_present,
                    }
                    students_attended.append(student_attended_data)
                except StudentAttended.DoesNotExist:
                    logger.error("StudentAttended attendance not found")
                    return Response({"message": "StudentAttended attendance not found"}, status=404)
            response_data["students_attended"] = students_attended

            return Response({"message": "Attendance object created", "attendance": response_data}, status=201)
        except Exception as e:
            logger.error("An error occurred")
            return Response({"message": "An error occurred"}, status=500)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="subject_code",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Subject code",
            )
        ],
        responses={200: dict}
    )
    @action(detail=False, methods=['get'], url_path='get_attendance_by_subject/(?P<subject_code>[^/.]+)', url_name='get_attendance_by_subject')
    def get_attendance_by_subject(self, request, subject_code: str=None):
        try:
            subject = get_object_or_404(Subject, subject_code=subject_code)
            
            attendance_data, student_list, current_attendance_data = self.attendance_service.get_attendance_by_subject(subject)

            if attendance_data:
                return Response({"message": "OK", "attendance": attendance_data, "current_attendance": current_attendance_data}, status=200)
            else:
                return Response({"message": "OK", "student_list": student_list}, status=200)

        except Exception as e:
            logger.error("An error occurred: %s. Subject code: %s", ) 
            return Response({"message": "An error occurred"}, status=500)

    @extend_schema(responses={201: AttendanceSerializer})
    @action(
        detail=False,
        methods=['post'],
        url_path='add_attendance_by_teacher',
        url_name='add_attendance_by_teacher')
    def add_attendance_by_teacher(self, request: Request) -> Response:
            data: Any  = request.data

            if isinstance(data, list) and len(data) > 0:
                first_item = data[0]
                subject_code: str = first_item.get('subject_code')
                student_list: list = first_item.get('students')

                if not subject_code or not student_list:
                    return Response({"message": "Invalid request"}, status=400)

            student_list_with_attendances: dict = {}
            for student in student_list:
                student_list_with_attendances[student.get("student_id")] = student.get("attendance_status")

            try:
                self.attendance_service.add_student_attendance(subject_code, student_list_with_attendances)
                return Response({"message": "Attendance added successfully"}, status=201)
            except Exception as e:
                return Response({"message": str(e)}, status=500)


    @extend_schema(responses={200: AttendanceSerializer})
    @action(detail=False, methods=['post'], url_path='mark_attendance', url_name='mark_attendance')
    def mark_attendance(self, request):
        try:
            attendance_code = request.data.get('attendance_code')
            student_id = request.data.get('student_id')
            if not attendance_code or not student_id:
                return Response({"message": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                student = Student.objects.get(student_id=student_id)
            except ObjectDoesNotExist as e:
                logger.error("Student not found") 
                return Response({"message": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                attendance = Attendance.objects.get(attendance_code=attendance_code)
                if attendance.is_active == False:
                    return Response({"message": "Attendance is not active"}, status=status.HTTP_400_BAD_REQUEST)

            except ObjectDoesNotExist as e:
                logger.error("Attendance not found") 
                return Response({"message": "Attendance not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                course = attendance.course
                subject_enroll = SubjectRegistration.objects.get(subject=course, student=student)
            except ObjectDoesNotExist as e:
                logger.error("Student not enrolled in the course") 
                return Response({"message": "Student is not enrolled in the course"}, status=status.HTTP_404_NOT_FOUND)

            alrady_marked = StudentAttended.objects.filter(student=student, attendance_code=attendance_code, is_present = True).exists()
            if alrady_marked:
                return Response({"message": "Attendance already marked"}, status=status.HTTP_200_OK)
            else:
                try:
                    student_attended = StudentAttended.objects.get(student=student, attendance_code=attendance_code, attendance_time=datetime.now())
                    student_attended.is_present = True
                    student_attended.save()
                    return Response({"message": "Attendance marked successfully"}, status=status.HTTP_201_CREATED)
                except ObjectDoesNotExist as e:
                    logger.error("Student attendance not found") 
                    return Response({"message": "Attendance not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            logger.error("An error occurred") 
            return Response({"message": f"An error occurred{e}",}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="subject_code",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Subject code",
            )
        ],
        responses={200: dict}
    )
    @action(detail=False, methods=['get'], url_path='get_attendance_by_student/(?P<subject_code>[^/.]+)', url_name='get_attendance_by_student')
    def get_attendance_by_student_subject(self, request, subject_code: str=None):
        try:
            try:
                username = request.user.username
                student = Student.objects.get(student_id=username)
                course = Subject.objects.get(subject_code=subject_code)
            except ObjectDoesNotExist as e:
                logger.error("Student not found")
                return Response({"message": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

            attendance = Attendance.objects.filter(students_attended__student=student, course=course)
            attendance_serializer = AttendanceSerializer(attendance, many=True)

            response_data = []

            for attendance_data in attendance_serializer.data:
                # Get course instance
                course_instance = Subject.objects.get(id=attendance_data['course'])
                course_serializer = SubjectSerializer(course_instance)
                subject_name = course_serializer.data.get('subject_name')

                student_attended_instances = StudentAttended.objects.filter(
                    student=student,
                    attendance__id=attendance_data['id'],
                )

                for student_attended_data in student_attended_instances.values():
                    transformed_data = {
                        'course': subject_name,
                        'is_present': student_attended_data.get('is_present'),
                        'attendance_code': student_attended_data.get('attendance_code'),
                        'date': str(attendance_data.get('date')),  # Convert date to string
                    }
                    response_data.append(transformed_data)

            return Response({"message": "Ok", "attendance": response_data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": f"An error occurred {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Subject code",
            )
        ],
        responses={200: dict}
    )
    @action(detail=False, methods=['put'], url_path='update_attendance_active/(?P<id>[^/.]+)', url_name='update_attendance_active')
    def update_attendance_active(self, request, id: str=None):
        try:
            try:
                attendance = Attendance.objects.get(id=id)
            except ObjectDoesNotExist as e:
                logger.error("Attendance not found")
                return Response({"message": "Attendance not found"}, status=status.HTTP_404_NOT_FOUND)

            if attendance.is_active:
                attendance.is_active = False
            else:
                attendance.is_active = True

            attendance.save()
            return Response({"message": "Attendance updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": f"An error occurred {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="subject_code",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Subject code",
            )
        ],
        responses={200: dict}
    )
    @action(detail=False, methods=['get'], url_path='get_student_info_for_inital_attendance/(?P<subject_code>[^/.]+)', url_name='get_attendance_by_subject')
    def get_student_info_for_inital_attendance(self, request, subject_code: str=None):
        try:
            subject = get_object_or_404(Subject, subject_code=subject_code)

            student_list = self.attendance_service.get_student_attendance_by_subject(subject)

            return Response({"message": "OK", "student_list": student_list}, status=200)

        except Exception as e:
            logger.error("An error occurred: %s. Subject code: %s", ) 
            return Response({"message": "An error occurred"}, status=500)
