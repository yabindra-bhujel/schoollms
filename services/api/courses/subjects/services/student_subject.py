
from courses.subjects.models import Subject, Assignment
from students.models import Student
from django.core.exceptions import ObjectDoesNotExist
from ..serializers import SubjectSerializer, AssignmentSerializer
import logging

logger = logging.getLogger(__name__)


class StduentSubjectService:
    def __init__(self, subject_code, stduent_id):
        self.__subject_code = subject_code
        self.__stduent_id = stduent_id

    def get_student_subject(self):
        stduent = Student.objects.get(student_id=self.__stduent_id)
        subject = Subject.objects.get(subject_code=self.__subject_code)

        if not stduent and not subject:
            logger.error("Student or Subject does not exist")
            raise ObjectDoesNotExist("Student or Subject does not exist")

        subject_data = SubjectSerializer(subject).data

        return subject_data













