import logging
from datetime import datetime
from django.contrib.auth import get_user_model
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist

from students.models import Student
from ..subjects.models import Subject, SubjectRegistration
from courses.subjects.serializers import SubjectRegistrationSerializer, SubjectSerializer
from .models import *
logger = logging.getLogger(__name__)
User = get_user_model()


class AttendanceService:
    def __init__(self):
        pass

    def add_student_attendance(self, subject_code: str, students: dict) -> Attendance:
        """
        Adds attendance for students in a given subject.
        """

        try:
            subject = Subject.objects.get(subject_code=subject_code)
            subject_enroll = SubjectRegistration.objects.get(subject=subject)
            today = datetime.now().date()

            if Attendance.objects.filter(course=subject, subject_enroll=subject_enroll, date=today).exists():
                raise ValueError("Attendance already taken for today.")

            with transaction.atomic():
                attendance = Attendance.objects.create(course=subject, subject_enroll=subject_enroll, date=today)

                for student_id, status in students.items():
                    try:
                        student = Student.objects.get(student_id=student_id)
                    except ObjectDoesNotExist:
                        raise ObjectDoesNotExist(
                            f"Student with ID '{student_id}' does not exist.")

                    is_present = self._parse_attendance_status(status)
                    if is_present is None:
                        continue 

                    # Attendance を 作成する際に StudentAttended を作成されている 
                    student_attended = StudentAttended.objects.filter(student=student, attendance=attendance).first()
                    if student_attended:
                        student_attended.is_present = is_present
                        student_attended.attendance_time = datetime.now()
                        student_attended.save()

                return attendance

        except ObjectDoesNotExist as e:
            logger.error(f"Object not found: {str(e)}")
            raise
        except ValueError as ve:
            logger.warning(f"Value error: {str(ve)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error in add_student_attendance: {str(e)}")
            raise

    def get_attendance_by_subject(self, subject: Subject, filters: dict) -> dict:
        """
        Get the attendance for a given subject.
        """

        attendance_query = Attendance.objects.filter(course=subject)

        if filters:
            if 'date' in filters:
                attendance_query = attendance_query.filter(date=filters['date'])
            
        attendance_data: list = []
    
        for att in attendance_query:
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

        return attendance_data

    def get_student_attendance_by_subject(self, subject: Subject) -> dict:
        """
        Get the list of students who have attended a given subject.
        """

        try:
            student_list = self._get_student_list(subject)
            return student_list
        
        except Exception as e:
            logger.error(f"Unexpected error in get_student_attendance_by_subject: {str(e)}")
            raise
         
    def _parse_attendance_status(self, status: str) -> bool:
        """
        Parses the attendance status string to a boolean.
        """

        status = status.lower()
        if status == "present":
            return True
        elif status == "absent":
            return False
        else:
            return None
        
    def _get_student_list(self, subject: Subject) -> list:
        """
        Get the list of students enrolled in a given subject.
        """

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

        return student_list
