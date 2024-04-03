from students.models import Student
from courses.subjects.models import SubjectRegistration, Assignment, Subject
from django.contrib.auth import get_user_model

User = get_user_model()

class StudentDetailService:
    
    def __init__(self, subject_code, stduent_id):
        self.__subject_code = subject_code
        self.__stduent_id = stduent_id

    def get_student_detail(self):
        """
        Retrieve student details including subjects and assignments.
        """
        student = self.__get_student_object()
        return {
            'student_id': student.student_id,
            'first_name': student.first_name,
            'last_name': student.last_name,
            'email': student.email,
            'phone': student.phone,
            'date_of_birth': student.date_of_birth,
            'city': student.city,
            'state': student.state,
            'country': student.country,
            'subjects': self.__get_subject_data()
        }

    def __get_subject_data(self):
        """
        Retrieve subjects enrolled by the student.
        """
        enrollment = SubjectRegistration.objects.filter(student=self.__student)
        subjects = []
        for subject in enrollment:
            subjects.append({
                'subject_code': subject.subject.subject_code,
                'subject': subject.subject.subject_name,
                'weekday': subject.subject.weekday,
                'start_time': subject.subject.period_start_time,
                'end_time': subject.subject.period_end_time,
                'class_room': subject.subject.class_room,
                'teacher': {
                    'teacher_id': subject.teacher.teacher_id,
                    'first_name': subject.teacher.first_name,
                    'last_name': subject.teacher.last_name,
                }, 
                'assignments': self.__get_assignment_data(subject.subject)
            })
        return subjects

    def __get_assignment_data(self, subject):
        """
        Retrieve assignments associated with a subject.
        """
        assignments = Assignment.objects.filter(subject=subject)
        assignment_data = []
        for assignment in assignments:
            assignment_data.append({
                'assignment_title': assignment.assignment_title,
                'assignment_description': assignment.assignment_description,
                'assignment_deadline': assignment.assignment_deadline,
                'assignment_posted_date': assignment.assignment_posted_date,
                'assignment_type': assignment.assignment_type,
                'assignment_start_date': assignment.assignment_start_date,
                'is_active': assignment.is_active,
            })
        return assignment_data

    def __get_subject_object(self, subject_code):
        """
        Retrieve the subject object based on the subject code.
        """
        return Subject.objects.get(subject_code=subject_code)
    
    def __get_student_object(self):
        """
        Retrieve the student object associated with the authenticated user.
        """
        user = User.objects.get(username=self.__stduent_id)
        return Student.objects.get(user=user)
