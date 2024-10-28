import os
import logging
from django.conf import settings
from ...models import *

logger = logging.getLogger(__name__)

class CreateFileSubmission:
    def __init__(self):
        pass

    def create(self, answer_files: dict, assignment: Assignment, student: Student) -> FileSubmission:
        try:
            media_dir = f"file_assignments/{assignment.start_date.strftime('%Y-%m-%d')}/"
            media_base_dir = settings.MEDIA_ROOT
            self.__ensureDirectoryExists(os.path.join(media_base_dir, media_dir))

            submission = None
            existing_submission = FileSubmission.objects.filter(assignment=assignment, student=student).first()
            if existing_submission:
                submission = existing_submission
                existing_submission.assignment_submission_file.clear()
                existing_submission.is_submited = True
                existing_submission.save()
            else:
                submission = FileSubmission.objects.create(assignment=assignment, student=student, is_submited=True)
                submission.save()

            if submission:
                for file in answer_files:
                    file_path = os.path.join(media_base_dir, media_dir, file.name)
                    with open(file_path, 'wb') as destination:
                        for chunk in file.chunks():
                            destination.write(chunk)
                    assignment_file = AssignmentFile.objects.create(file=file_path)
                    submission.assignment_submission_file.add(assignment_file)
            else:
                raise Exception("Failed to create file submission")
            
            assignment.submission_count = FileSubmission.objects.filter(assignment=assignment, is_submited=True).count()
            assignment.save()
            return submission
        
        except Exception as e:
            logger.error(f"Error creating file assignment: {e}")
            raise e
        
    def __ensureDirectoryExists(self, directory: str):
        if not os.path.exists(directory):
            os.makedirs(directory)
        

       