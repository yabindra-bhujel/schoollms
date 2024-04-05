from datetime import datetime
from django.shortcuts import get_object_or_404
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
from django.db import transaction
from dateutil import parser
from django.utils.timezone import make_aware
from django.core.exceptions import ObjectDoesNotExist
import logging
from teachers.models import Teacher
from students.models import Student
from courses.serializers import AttendanceSerializer, StudentAttendedSerializer
from ..subjects.models import Subject, SubjectRegistration
from courses.subjects.serializers import SubjectRegistrationSerializer


logger = logging.getLogger(__name__)

class AttendanceViewSet(viewsets.ViewSet):
    serializer_class = AttendanceSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: AttendanceSerializer})
    @action(detail=False, methods=['post'], url_path='create_attendance', url_name='create_attendance')
    def createAttendance(self, request):
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
            print(e)
            logger.error("An error occurred")
            return Response({"message": "An error occurred"}, status=500)


    @extend_schema(responses={200: AttendanceSerializer})
    @action(detail=False, methods=['get'], url_path='get_attendance_by_subject/(?P<subject_code>[^/.]+)', url_name='get_attendance_by_subject')
    def getAttendanceBySubject(self, request, subject_code=None):
        try:
            subject = get_object_or_404(Subject, subject_code=subject_code)

            enroll_students = SubjectRegistration.objects.filter(subject=subject)
            serializer = SubjectRegistrationSerializer(enroll_students, many=True)

            student_ids = []
            for enroll_student in serializer.data:
                # Check for existence of 'student' key before accessing it
                if 'student' in enroll_student:
                    student_ids.extend([student['Student_id'] for student in enroll_student['student']])

            students = Student.objects.filter(student_id__in=student_ids)

            student_list = [{
                "student_id": student.student_id,
                "full_name": f"{student.first_name} {student.last_name}",
                "course": subject.subject_name,
            } for student in students]

            attendance = Attendance.objects.filter(course=subject)
            attendance_data = []

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
                return Response({"message": "OK", "attendance": attendance_data}, status=200)
            else:
                return Response({"message": "OK", "student_list": student_list}, status=200)

        except Exception as e:
            logger.error("An error occurred: %s. Subject code: %s", e, subject_code)  # Log specific subject code for debugging
            return Response({"message": "An error occurred"}, status=500)
