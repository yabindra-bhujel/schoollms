from ...models import *
from ...serializers import *
from rest_framework.request import Request
from datetime import datetime
from django.conf import settings

class TeacherAssignmentDetailsService:

    def __init__(self):
        pass

    def get_assignment_details(self, assignment: Assignment, request: Request):
        try:
            # Serialize assignment data and add formatted dates
            response_data = self._serialize_assignment(assignment)
            response_data["questions"] = self._get_questions(assignment)
            response_data["formatted_posted_date"] = self._format_iso_date(response_data.get("posted_date"))
            response_data["formatted_assignment_deadline"] = self._format_iso_date(response_data.get("deadline"))

            # Fetch and add submission details based on assignment type
            submission_data = self._get_submission_data(assignment, request)
            response_data["submissions"] = submission_data
            
            return response_data
        except Exception as e:
            raise e

    def _serialize_assignment(self, assignment: Assignment):
        serializer = AssignmentSerializer(assignment)
        return serializer.data.copy()

    def _get_questions(self, assignment: Assignment):
        questions = assignment.questions.all()
        return [{"id": question.id, "question": question.question} for question in questions]

    def _get_submission_data(self, assignment: Assignment, request: Request):
        if assignment.assigment_type == Assignment.AssignmentType.TEXT:
            return self._get_text_submissions(assignment, request)
        elif assignment.assigment_type == Assignment.AssignmentType.FILE:
            return self._get_file_submissions(assignment, request)
        return []

    def _get_text_submissions(self, assignment: Assignment, request: Request):
        text_submissions = TextSubmission.objects.filter(assignment=assignment)
        submission_data = []
        for submission in text_submissions:
            student = submission.student
            submission_info = {
                "assignment_title": assignment.title,
                "id": submission.id,
                "student_name": f"{student.first_name} {student.last_name}",
                "student_id": student.student_id,
                "submission_datetime": self._format_iso_date(str(submission.submission_time)),
                "is_submitted": submission.is_submitted,
                "assignment_answer": self._get_absolute_file_url(submission.student_answer_file, request),
                "type": "Text",
                "is_graded": submission.is_graded,
                "grade": submission.grade,
            }
            submission_data.append(submission_info)
        return submission_data

    def _get_file_submissions(self, assignment: Assignment, request: Request):
        file_submissions = FileSubmission.objects.filter(assignment=assignment)
        serializer = FileSubmissionSerializer(file_submissions, many=True, context={"request": request})
        
        submission_data = []
        for submission in serializer.data:
            file_submission_instance = FileSubmission.objects.get(id=submission["id"])
            files = file_submission_instance.assignment_submission_file.all()

            student = Student.objects.get(student_id=submission["student"])
            formatted_data = {
                "assignment_title": assignment.title,
                "id": submission["id"],
                "student_name": f"{student.first_name} {student.last_name}",
                "student_id": student.student_id,
                "submission_datetime": self._format_iso_date(submission.get("submission_datetime")),
                "is_submitted": submission.get("is_submitted"),
                "files": [],
                "type": "File",
                "is_graded": submission.get("is_graded"),
                "grade": submission.get("grade"),
            }

            for file in files:
                base_url = f"{settings.MEDIA_URL}file_assignments/{assignment.start_date.strftime('%Y-%m-%d')}/"
                filename = file.file.name.split('/')[-1]
                file_url = f"{base_url}{filename}"
                full_url = request.build_absolute_uri(file_url)

                file_submission_file = {
                    "id": file.id,
                    "file": full_url,
                }

                formatted_data["files"].append(file_submission_file)

            submission_data.append(formatted_data)
        return submission_data

    def _format_iso_date(self, iso_date: str):
        if iso_date:
            date = datetime.fromisoformat(iso_date)
            return date.strftime("%Y-%m-%d %H:%M:%S")
        return None

    def _get_absolute_file_url(self, file_field, request: Request):
        if file_field:
            return request.build_absolute_uri(file_field.url)
        return None
