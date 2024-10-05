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

logger = logging.getLogger(__name__)

class AttendanceViewSet(viewsets.ViewSet):
    serializer_class = AttendanceSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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

            enroll_students = SubjectRegistration.objects.filter(subject=subject)
            serializer = SubjectRegistrationSerializer(enroll_students, many=True)

            student_ids = []
            for enroll_student in serializer.data:
                if 'students' in enroll_student:
                    students_data = enroll_student['students']
                    if isinstance(students_data, list):
                        student_ids.extend([student['student_id'] for student in students_data])

            students = Student.objects.filter(student_id__in=student_ids)

            student_list = [{
                "student_id": student.student_id,
                "full_name": f"{student.first_name} {student.last_name}",
                "course": subject.subject_name,
            } for student in students]

            attendance = Attendance.objects.filter(course=subject)
            attendance_data = []
            current_attendance = []
            current_attendance = Attendance.objects.filter(course=subject, attendance_code__isnull=False).order_by('-created_at').first()
            if current_attendance:
                current_attendance_data = {
                    "id": current_attendance.id,
                    "attendance_code": current_attendance.attendance_code,
                    "is_active": current_attendance.is_active,
                }


            for att in attendance:
                course_name = att.course.subject_name

                students_attended = []
                for student_attended in att.students_attended.all():
                    student_attended_data = {
                        "student_id": student_attended.student.student_id,
                        "full_name": f"{student_attended.student.first_name} {student_attended.student.last_name}",
                        "is_present": student_attended.is_present,
                    }
                    students_attended.append(student_attended_data)

                attendance_data.append({
                    "id": att.id,
                    "date": att.date,
                    "attendance_code": att.attendance_code,
                    "is_active": att.is_active,
                    "course": course_name,
                    "subject_enroll": att.subject_enroll.id,
                    "students_attended": students_attended
                })

            if attendance_data:
                return Response({"message": "OK", "attendance": attendance_data, "current_attendance": current_attendance_data}, status=200)
            else:
                return Response({"message": "OK", "student_list": student_list}, status=200)

        except Exception as e:
            logger.error("An error occurred: %s. Subject code: %s", ) 
            return Response({"message": "An error occurred"}, status=500)


    @extend_schema(responses={200: AttendanceSerializer})
    @action(detail=False, methods=['post'], url_path='add_attendance_by_teacher', url_name='add_attendance_by_teacher')
    def add_attendance_by_teacher(self, request):
        try:
            data = request.data
            subject_code = data.get('course_id')
            student_list = data.get('studentIds')

            try:
                subject = Subject.objects.get(subject_code=subject_code)
                subject_enroll = SubjectRegistration.objects.get(subject=subject)
                today = datetime.now().date()

                if Attendance.objects.filter(course=subject, subject_enroll=subject_enroll, date=today).exists():
                    return Response({"message": "Attendance already taken for today"}, status=400)
                
                try:
                    with transaction.atomic():
                        attendance = Attendance.objects.create(course=subject, subject_enroll=subject_enroll)
                        attendance.save()

                        selected_student_ids = []
                        for student_id in student_list:
                            if student_list[student_id]:
                                selected_student_ids.append(student_id)

                        for student_id in selected_student_ids:
                            student = Student.objects.get(student_id=student_id)
                            student_attended = StudentAttended.objects.create(student=student, is_present=True, attendance=attendance, attendance_time=datetime.now())
                            student_attended.save()
                            attendance.students_attended.add(student_attended)

                        attendance.save()
                except Exception as e:
                    logger.error("An error occurred")
                    return Response({"message": "An error occurred"}, status=500)
            except ObjectDoesNotExist as e:
                logger.error("Course not found")
                return Response({"message": "Course not found"}, status=404)
            
            attendance_serializer = AttendanceSerializer(attendance)
            return Response({"message": "Attendance object created", "attendance": attendance_serializer.data}, status=201)
        except Exception as e:
            logger.error("An error occurred")
            return Response({"message": "An error occurred"}, status=500)


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
    # @extend_schema(responses={200: AttendanceSerializer}, description="Update attendance active status if it is active chnage to inactive if it is inactive change to active need to id of attendance in url")
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
