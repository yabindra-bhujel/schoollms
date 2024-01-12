from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase
from django.contrib.auth import get_user_model
from teacher.models import Teacher
from teacher.views import add_teacher,teacher_list,teacher_detail
User = get_user_model()


class TestCreateTeacher(APITestCase):
    databases = {'default'}
    def setUp(self):
        self.factory = APIRequestFactory()
        self.create_teacher_url = reverse('create_teacher')



        self.teacher = Teacher.objects.create(
            TeacherID=2121,
            first_name="Test Teacher",
            last_name="Last Name",
            phone="Test phone",
            gender="Male",
            address="Test address",
            image="Test image",
            date_of_birth="2021-01-22"
        )

    def test_create_teacher(self):
        teacher_data = {
            "TeacherID": "1234",
            "first_name": "John",
            "last_name": "Doe",
            "gender": "Male",
            "phone": "1234567890",
            "address": "123 Main St",
            "date_of_birth": "1990-01-01",
        }

        request = self.factory.post(self.create_teacher_url, teacher_data, format='json')
        response = add_teacher(request)
            
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)




    def test_teacher_list(self):
        request = self.factory.get('/teacher/')  # Use the URL pattern you defined


        # Call the teacher_list view function to handle the request
        response = teacher_list(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)




    def test_teacher_details(self):
        request = self.factory.get('/teacher/2121/')
        response = teacher_detail(request, TeacherID=2121)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


        #  Check the structure of the response data
        self.assertIn('teacher', response.data)
        self.assertIn('subjects', response.data)



        # Verify subject details
        subjects_data = response.data['subjects']
        self.assertTrue(isinstance(subjects_data, list))
        if subjects_data:
            subject_data = subjects_data[0]  # Assuming at least one subject is present
            self.assertIn('subject_code', subject_data)
            self.assertIn('subject_name', subject_data)
            self.assertIn('subject_description', subject_data)
            # Add more assertions for subject attributes



    
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from courses.models import Assignment, TextAssigemntQuestion, TextSubmission, FileSubmission
from courses.serializers import AssignmentSerializer, FileSubmissionSerializer
from courses.views import assignment_details
from datetime import datetime
from django.utils import timezone


class TestAssignmentDetails(APITestCase):
    databases = {'default'}

    def setUp(self):
        self.assignment = Assignment.objects.create(
            title="Test Assignment",
            description="Test Assignment Description",
            assignment_type="Text",
            submission_count=0,
            assignment_posted_date=timezone.now(),
            assignment_deadline=timezone.now(),
        )

        self.question = TextAssigemntQuestion.objects.create(
            assignment=self.assignment,
            question="Test Question",
        )

        self.text_submission = TextSubmission.objects.create(
            assignment=self.assignment,
            student_id=1,
            submission_time=timezone.now(),
            is_submited=True,
        )

        self.file_submission = FileSubmission.objects.create(
            assignment=self.assignment,
            student_id=1,
            submission_datetime=timezone.now(),
            is_submited=True,
            assignment_submission_file="https://example.com/file.pdf",
        )

    def test_assignment_details(self):
        url = reverse("assignment_details", kwargs={"id": self.assignment.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the response data matches the expected data
        expected_data = AssignmentSerializer(self.assignment).data
        expected_data["questions"] = [{"id": self.question.id, "question": self.question.question}]
        expected_data["formatted_posted_date"] = self.assignment.assignment_posted_date.strftime("%Y-%m-%d %H:%M:%S")
        expected_data["formatted_assignment_deadline"] = self.assignment.assignment_deadline.strftime("%Y-%m-%d %H:%M:%S")
        expected_data["submissions"] = [
            {
                "student_id": self.text_submission.student_id,
                "submission_datetime": self.text_submission.submission_time.strftime("%Y-%m-%d %H:%M:%S"),
                "is_submitted": self.text_submission.is_submited,
                "assignment_answer": [{"question": self.question.question, "answer": ""}],
            },
            {
                "student_id": self.file_submission.student_id,
                "submission_datetime": self.file_submission.submission_datetime.strftime("%Y-%m-%d %H:%M:%S"),
                "is_submitted": self.file_submission.is_submited,
                "assignment_submission_file_url": self.file_submission.assignment_submission_file,
            },
        ]

        self.assertEqual(response.data, expected_data)

    def test_assignment_details_not_found(self):
        url = reverse("assignment_details", kwargs={"id": 999})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_assignment_details_error(self):
        # Force an error by setting the assignment type to an invalid value
        self.assignment.assignment_type = "Invalid"
        self.assignment.save()

        url = reverse("assignment_details", kwargs={"id": self.assignment.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)