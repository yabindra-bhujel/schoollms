import os
import logging
from datetime import datetime
from django.conf import settings
from utils.pdf_generator import PDFGenerator
from ...models import *

logger = logging.getLogger(__name__)

class CreateTextSubmission:
    def __init__(self):
        pass

    def create(self, answer_data: dict, assignment: Assignment, student: Student):
        try:
            textsubmission = self._create_or_reset_submission(assignment, student)
            self._add_answers_to_submission(textsubmission, answer_data)
            pdf_path = self._generate_pdf(textsubmission, assignment, student)
            self._update_submission_file(textsubmission, pdf_path)
            self._update_submission_count(assignment, student)

        except Exception as e:
            logger.error(f"Error creating text assignment: {e}")
            raise e

    def _create_or_reset_submission(self, assignment: Assignment, student: Student) -> TextSubmission:
        """
        Retrieve an existing TextSubmission or create a new one.
        If an existing submission is found, it is deleted before creating a new one.
        """
        # Retrieve existing submission or create a new one
        textsubmission = TextSubmission.objects.filter(assignment=assignment, student=student).first()
        if textsubmission:
            textsubmission.delete()
        
        # Create and return a new TextSubmission
        return TextSubmission.objects.create(
            assignment=assignment, 
            student=student, 
            is_submitted=True
        )

    def _add_answers_to_submission(self, textsubmission: TextSubmission, answer_data: dict):
        """
        Add answers to the text submission from provided answer data.
        """
        for answer in answer_data:
            question_id = answer.get("question_id")
            answer_text = answer.get("answer")
            question = TextAssigemntQuestion.objects.get(id=question_id)
            text_answer = TextQuestionAnswer.objects.create(
                question_id=question_id,
                answer=answer_text
            )
            textsubmission.answers.add(text_answer)
        textsubmission.save()

    def _generate_pdf(self, textsubmission: TextSubmission, assignment: Assignment, student: Student) -> str:
        """
        Generate a PDF for the text submission and save it to the specified directory.
        Returns the path to the generated PDF.
        """
        filename = f"{student.student_id}.pdf"
        assignment_create_date = assignment.start_date.strftime("%Y-%m-%d")
        current_date = datetime.now().strftime("%Y-%m-%d")
        full_name = f"{student.first_name} {student.last_name}"
        question_answers = [
            {"question": answer.question.question, "answer": answer.answer}
            for answer in textsubmission.answers.all()
        ]



        media_dir = f"text_assignments/{assignment_create_date}/"
        media_base_dir = settings.MEDIA_ROOT
        self._ensure_directory_exists(os.path.join(media_base_dir, media_dir))
        pdf_file_path = os.path.join(media_base_dir, media_dir, filename)

        pdf = PDFGenerator(
            filename=pdf_file_path, 
            title=assignment.title, 
            student_name=full_name, 
            date=current_date, 
            student_id=student.student_id
        )
        pdf.pdf_header()
        for question_answer in question_answers:
            pdf.add_question_and_answer(question_answer["question"], question_answer["answer"])
        pdf.save()

        return os.path.join(media_dir, filename)

    def _update_submission_file(self, textsubmission: TextSubmission, pdf_path: str):
        """
        Update the TextSubmission with the path to the generated PDF.
        """
        textsubmission.student_answer_file = pdf_path
        textsubmission.save()

    def _update_submission_count(self, assignment: Assignment, student: Student):
        """
        Update the submission count for the assignment.
        """
        assignment.submission_count = TextSubmission.objects.filter(
            assignment=assignment, 
            is_submitted=True, 
            student=student
        ).count()
        assignment.save()

    def _ensure_directory_exists(self, directory: str):
        """
        Ensure that the specified directory exists, creating it if necessary.
        """
        if not os.path.exists(directory):
            os.makedirs(directory)
