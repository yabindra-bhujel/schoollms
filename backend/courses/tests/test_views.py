from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from courses.models import *
from courses.serializers import *
import json



class CourseViewsTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.course_data = {
            "subject_code": "CS101",
            "subject_name": "Introduction to Computer Science",
            "department": "Computer Science",
            "semester": "1",
            "year": "2022",
        }
        self.response = self.client.post(
            reverse("create_course"), self.course_data, format="json"
        )

    def test_create_course(self):
        self.assertEqual(self.response.status_code, status.HTTP_201_CREATED)

    def test_get_course_list(self):
        response = self.client.get(reverse("course_list"))
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_course_details(self):
        course = Course.objects.get()
        response = self.client.get(reverse("course_details", kwargs={"subject_code": course.subject_code}))
        serializer = CourseSerializer(course)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_enroll_student(self):
        response = self.client.get(reverse("enroll_student"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_assignment(self):
        assignment_data = {
            "title": "Assignment 1",
            "description": "This is the first assignment",
            "due_date": "2022-01-31T00:00:00Z",
            "course": 1,
        }
        response = self.client.post(
            reverse("create_assignment"), assignment_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_assignment_details(self):
        assignment = Assignment.objects.get()
        response = self.client.get(reverse("assignment_details", kwargs={"id": assignment.id}))
        serializer = AssignmentSerializer(assignment)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_assignment(self):
        response = self.client.get(reverse("get_all_assignment", kwargs={"username": "testuser"}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_active_assignment(self):
        response = self.client.get(reverse("get_active_assignment", kwargs={"username": "testuser"}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_past_assignment(self):
        response = self.client.get(reverse("get_past_assignment", kwargs={"username": "testuser"}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_future_assignment(self):
        response = self.client.get(reverse("get_future_assignment", kwargs={"username": "testuser"}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)



class CourseViewsTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.course_data = {
            "subject_code": "CS101",
            "subject_name": "Introduction to Computer Science",
            "department": "Computer Science",
            "semester": "1",
            "year": "2022",
        }
        self.response = self.client.post(
            reverse("create_course"), self.course_data, format="json"
        )

    def test_assignment_details(self):
        # Create an assignment
        assignment_data = {
            "title": "Assignment 1",
            "description": "This is the first assignment",
            "due_date": "2022-01-31T00:00:00Z",
            "course": 1,
        }
        response = self.client.post(
            reverse("create_assignment"), assignment_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Get the assignment details
        assignment_id = response.data["id"]
        response = self.client.get(reverse("assignment_details", kwargs={"id": assignment_id}))

        # Check that the response is successful
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the response data contains the expected fields
        self.assertIn("id", response.data)
        self.assertIn("title", response.data)
        self.assertIn("description", response.data)
        self.assertIn("due_date", response.data)
        self.assertIn("course", response.data)
        self.assertIn("assignment_type", response.data)
        self.assertIn("submission_count", response.data)
        self.assertIn("assignment_posted_date", response.data)
        self.assertIn("assignment_deadline", response.data)
        self.assertIn("questions", response.data)
        self.assertIn("submissions", response.data)

        # Check that the questions field contains the expected data
        self.assertIsInstance(response.data["questions"], list)
        self.assertEqual(len(response.data["questions"]), 0)

        # Check that the submissions field contains the expected data
        self.assertIsInstance(response.data["submissions"], list)
        self.assertEqual(len(response.data["submissions"]), 0)