from courses.subjects.models import Subject, SubjectRegistration, Announcement, AnnouncementFile
from students.models import Student
from common.models import Notification
from django.contrib.auth import get_user_model
from django.db import transaction
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

class AnnouncementService:
    def __init__(self, request):
        self.request = request

    def create_announcement(self):
        try:
            subject_code = self.request.data.get('subject_code')
            title = self.request.data.get('title')
            content = self.request.data.get('content')
            files = self.request.FILES.getlist('file')

            with transaction.atomic():

                subject = self.__get_subject(subject_code)
                students = self.__get_enrolled_students(subject)

                announcement = self.__create_announcement_object(subject, title, content)
                self.__attach_files_to_announcement(announcement, files)

                self.__create_notification(announcement, students)

            return announcement

        except Exception as e:
            logger.error(f"Error creating announcement: {e}")
            raise Exception(f"Error creating announcement: {e}")

    def __get_subject(self, subject_code):
        try:
            return Subject.objects.get(subject_code=subject_code)
        except Subject.DoesNotExist:
            logger.error("Subject does not exist")
            raise Exception("Subject does not exist")

    def __get_enrolled_students(self, subject):
        enrolled_students = SubjectRegistration.objects.filter(subject=subject)
        student_ids = enrolled_students.values_list('student', flat=True)
        return Student.objects.filter(student_id__in=student_ids)

    def __create_announcement_object(self, subject, title, content):
        try:
            announcement = Announcement.objects.create(subject=subject, announcement_title=title, announcement_description=content)
            return announcement
        except Exception as e:
            logger.error(f"Error creating announcement object: {e}")
            raise Exception(f"Error creating announcement object: {e}")

    def __attach_files_to_announcement(self, announcement, files):
        if files:
            try:
                for file in files:
                    announcement_file = AnnouncementFile(file=file)
                    announcement_file.save()
                    announcement.announcement_file_url.add(announcement_file)
            except Exception as e:
                raise Exception(f"Error attaching files to announcement: {e}")

    def __create_notification(self, announcement, students):
        try:
            notification = Notification.objects.create(
                title='New Announcement',
                content=f'New announcement "{announcement.announcement_title}" has been created.',
            )
            for student in students:
                user = User.objects.filter(username=student.student_id).first()
                if user:
                    notification.user.add(user)
            notification.save()
        except Exception as e:
            logger.error(f"Error creating notification: {e}")
            raise Exception(f"Error creating notification: {e}")

