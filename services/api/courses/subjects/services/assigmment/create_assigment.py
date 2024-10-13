from django.shortcuts import get_object_or_404
from courses.subjects.models import *
from common.models import Notification
from students.models import Student
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

class CreateAssignment:
    def __init__(self, data):
        self.data = data

    def create_assignment(self):
        try:
            with transaction.atomic():
                subject_code = self.data['course']
                subject = get_object_or_404(Subject, subject_code=subject_code)

                student_ids = self.data['students']
                students = Student.objects.filter(student_id__in=student_ids)
                questions = self.data.get("questions", [])



                assignment = Assignment.objects.create(
                    title=self.data['assignment_title'],
                    description=self.data['assignment_description'],
                    course=subject,
                    assigment_type=self.data['assignment_type'],
                    max_grade=self.data['max_grade'],
                    start_date=self.data['assignment_start_date'],
                    deadline=self.data['assignment_deadline'],
                )
                assignment.students.set(students)


                # Create TextAssignmentQuestion instances and associate them with the assignment
                if assignment.assigment_type == 'Text':
                    text_questions = [TextAssigemntQuestion(question=q.get('text', '')) for q in questions]
                    TextAssigemntQuestion.objects.bulk_create(text_questions)
                    assignment.questions.add(*text_questions)

                # Create notification for students
                notification = Notification.objects.create(
                    title='New Assignment',
                    content=f'New assignment "{assignment.title}" has been created.',
                )
                notification.user.set(User.objects.filter(username__in=student_ids))
                
            return {'message': 'Assignment created successfully',}
        except ObjectDoesNotExist:
            logger.error('One or more objects does not exist')
            return {'error': 'One or more objects does not exist'}
