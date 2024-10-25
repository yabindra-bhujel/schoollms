from datetime import datetime
from django.shortcuts import get_object_or_404
from .services.assigmment.CreateAssignmentService import CreateAssignmentService
from .services.student_subject import StduentSubjectService
from .services.subject_registration import SubjectRegisterService
from .models import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import viewsets
from rest_framework.decorators import action
from .services.subject_service import SubjectService
from .serializers import *
from .services.teacher_subject import TeacherSubjectService
from .services.announcement import AnnouncementService
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from dateutil import parser
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.openapi import OpenApiTypes
from typing import Optional
import logging
from .services.assigmment.CreateTextSubmission import CreateTextSubmission
from .services.assigmment.CreateFileSubmission import CreateFileSubmission
from .services.assigmment.TeacherAssigmentDetailsService import TeacherAssignmentDetailsService
from django.conf import settings

logger = logging.getLogger(__name__)
User = get_user_model()

@extend_schema(tags=["Admin Subject"])
class AdminSubjectViewSet(viewsets.ViewSet):
    serializer_class = SubjectSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = "id"

    def list(self, request):
        queryset = Subject.objects.all()
        serializer = SubjectSerializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="subject_code",
                description="Code of the subject",
                required=True,
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
            )
        ],
        responses={200: SubjectSerializer},
    )
    @action(detail=False,methods=["get"],url_path="(?P<subject_code>[^/.]+)",url_name="subject_detail")
    def subject_detail(self, request, subject_code: str = None):
        queryset = Subject.objects.all()
        subject = get_object_or_404(queryset, subject_code=subject_code)
        serializer = SubjectSerializer(subject)
        return Response(serializer.data)

    def create(self, request):
        new_subject = SubjectService(request.data).create_subject()
        if "error" in new_subject:
            return Response(new_subject, status=status.HTTP_400_BAD_REQUEST)
        return Response(new_subject, status=status.HTTP_201_CREATED)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the subject",
            )
        ],
        responses={200: SubjectSerializer},
    )
    def update(self, request, id: Optional[int] = None):
        queryset = Subject.objects.all()
        subject = get_object_or_404(queryset, id=id)
        serializer = SubjectSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the subject",
            )
        ],
    )
    def destroy(self, request, id: Optional[int] = None):
        queryset = Subject.objects.all()
        subject = get_object_or_404(queryset, id=id)
        subject.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@extend_schema(tags=["Subject Registration"])
class SubjectRegistrationViewSet(viewsets.ViewSet):
    serializer_class = SubjectRegistrationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def list(self, request):
        queryset = SubjectRegistration.objects.all()
        serializer = SubjectRegistrationSerializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the subject registration",
            )
        ],
        responses={200: SubjectRegistrationSerializer},
    )
    def retrieve(self, request, id: int = None):
        queryset = SubjectRegistration.objects.all()
        registration = get_object_or_404(queryset, id=id)
        serializer = SubjectRegistrationSerializer(registration)
        return Response(serializer.data)

    def create(self, request):
        new_registration = SubjectRegisterService(request.data).register()
        return Response(
            SubjectRegistrationSerializer(new_registration).data,
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the subject registration",
            )
        ],
        responses={200: SubjectRegistrationSerializer},
    )
    def update(self, request, id: int = None):
        queryset = SubjectRegistration.objects.all()
        registration = get_object_or_404(queryset, id=id)
        serializer = SubjectRegistrationSerializer(registration, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the subject registration",
            )
        ],
    )
    def destroy(self, request, id: int = None):
        queryset = SubjectRegistration.objects.all()
        registration = get_object_or_404(queryset, id=id)
        registration.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@extend_schema(tags=["Student Subject"])
class StudentSubjectViewSet(viewsets.ViewSet):
    serializer_class = SubjectSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the subject registration",
            )
        ],
        responses={200: SubjectSerializer},
    )
    def retrieve(self, request, id: int=None):
        stduent_subject = StduentSubjectService(id, request.user.username).get_student_subject()
        return Response(stduent_subject)

@extend_schema(tags=["Teacher Subject"])
class TeacherSubjectViewSet(viewsets.ViewSet):
    serializer_class = SubjectSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the subject registration",
            ),
        ],
        responses={200: SubjectSerializer},
    )
    def retrieve(self, request, id: int = None):
        teacher_subject = TeacherSubjectService(
            id, request.user.username
        ).get_teacher_subject()
        return Response(teacher_subject)

@extend_schema(tags=["Assigment"])
class AssigmentViewSet(viewsets.ViewSet):
    serializer_class = AssignmentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    ueryset = Assignment.objects.all()
    lookup_field = "id"

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="subject_code",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Code of the subject",
            )
        ],
        responses={200: AssignmentSerializer},
    )
    @action(detail=False, 
            methods=['get'], url_path='assignment-list/(?P<subject_code>[^/.]+)', url_name='assignment_list')
    def assignment_list(self, request, subject_code: str=None):

        query_params: dict = request.query_params
        available = query_params.get('available')
        not_available = query_params.get('not_available')
        available = available.lower() == 'true' if available is not None else None
        not_available = not_available.lower() == 'true' if not_available is not None else None

        if available is True:
            queryset = Assignment.objects.filter(course__subject_code=subject_code, is_active=True)
        elif not_available is True:
            queryset = Assignment.objects.filter(course__subject_code=subject_code, is_active=False)
        else:
            queryset = Assignment.objects.filter(course__subject_code=subject_code)
        
        serializer = AssignmentSerializer(queryset, many=True)
        return Response(serializer.data)

    
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="subject_code",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Code of the subject",
            )
        ],
        responses={200: AssignmentSerializer},
    )
    @action(detail=False, methods=['get'], url_path='student-assignment/(?P<subject_code>[^/.]+)', url_name='assignment_detail')
    def subject_assignment_by_stduent(self, request, subject_code: str=None):
                
        query_params: dict = request.query_params
        available = query_params.get('available')
        not_available = query_params.get('not_available')
        available = available.lower() == 'true' if available is not None else None
        not_available = not_available.lower() == 'true' if not_available is not None else None

        user = User.objects.get(username=request.user.username)
        student = Student.objects.get(user=user)
        subject = Subject.objects.get(subject_code=subject_code)

        registrations = SubjectRegistration.objects.filter(subject=subject)
        serializer = SubjectRegistrationSerializer(registrations, many=True)

        assignment_data = []

        for _ in serializer.data:

            if available is True:
                assignments = Assignment.objects.filter(course=subject, is_published=True, is_active=True)
            elif not_available is True:
                assignments = Assignment.objects.filter(course=subject, is_published=True, is_active=False)
            else:
                assignments = Assignment.objects.filter(course=subject, is_published=True)

            for assignment in assignments:
                has_submitted = assignment.has_student_submitted(student)
                assignment_serializer = AssignmentSerializer(assignment)
                assignment_dict = assignment_serializer.data
                assignment_dict['has_submitted'] = has_submitted
                assignment_dict['is_active'] = assignment.is_active
                assignment_data.append(assignment_dict)

        return Response(assignment_data)

    def create(self, request):
        new_assignment = CreateAssignmentService(request.data).create_assignment()
        return Response(new_assignment,  status=status.HTTP_201_CREATED)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the assignment",
            )
        ],
        responses={200: AssignmentSerializer},
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="student-assignment-detail/(?P<id>[^/.]+)",
        url_name="assignment_detail",
    )
    def student_assignment_detail(self, request, id: int):
        user = User.objects.get(username=request.user.username)
        student = Student.objects.get(user=user)
        assignment = Assignment.objects.get(id=id)

        serializer = AssignmentSerializer(assignment)
        response_data = serializer.data.copy()

        response_data.pop("submission_count")
        response_data.pop("students")

        if assignment.assigment_type == Assignment.AssignmentType.TEXT:
            response_data["questions"] = []
            questions = assignment.questions.all()
            for question in questions:
                question_data = {"id": question.id, "question": question.question}
                text_submission = TextSubmission.objects.filter(assignment=assignment, student=student).first()
                if text_submission:
                    answer = text_submission.answers.filter(question=question).first()
                    question_data["answer"] = answer.answer if answer else None
                else:
                    question_data["answer"] = None
                response_data["questions"].append(question_data)

        elif assignment.assigment_type == Assignment.AssignmentType.FILE:
            response_data["file_submissions"] = []
            file_submissions = FileSubmission.objects.filter(assignment=assignment, student=student)

            for file_submission in file_submissions:
                files = file_submission.assignment_submission_file.all()

                for file in files:
                    base_url = f"{settings.MEDIA_URL}file_assignments/{assignment.start_date.strftime('%Y-%m-%d')}/"
                    filename = file.file.name.split('/')[-1]
                    file_url = f"{base_url}{filename}"
                    full_url = request.build_absolute_uri(file_url)

                    file_submission_data = {
                        "id": file.id,
                        "files": full_url
                    }

                    response_data["file_submissions"].append(file_submission_data)

        return Response(response_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='create-text-assignment', url_name='create-text-assignment')
    def create_text_assignment(self, request):
        student_id = request.data.get("student")
        assignment_id = request.data.get("assignment_id")
        answers = request.data.get("answers", [])

        try:

            if not student_id or not assignment_id or not answers:
                logger.error("Invalid data format for text assignment")
                return Response({"error": "Invalid data format"}, status=status.HTTP_400_BAD_REQUEST)
            
            assignment = get_object_or_404(Assignment, id=assignment_id)
            student = get_object_or_404(Student, student_id=student_id)

            CreateTextSubmission().create(answers, assignment, student)
            
            return Response(status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(e)
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='create-file-assignment', url_name='create-file-assignment')
    def create_file_assignment(self, request):
        answer_files = request.FILES.getlist("file_submission")
        assignment_id = request.data.get("assignment_id")
        student_id = request.data.get("student")

        try:
            try:
                assignment = get_object_or_404(Assignment, id=assignment_id)
                student = get_object_or_404(Student, student_id=student_id)
            except ObjectDoesNotExist as e:
                logger.error(e)
                return Response({"message": "Assignment not found"}, status=404)

            CreateFileSubmission().create(answer_files, assignment, student)

            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(e)
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the assignment",
            )
        ],
        responses={200: AssignmentSerializer},
    )
    @action(detail=False, methods=['get'], url_path='teacher-assignment-detail/(?P<id>[^/.]+)', url_name='teacher-assignment-detail')
    def teacher_assignment_detail(self, request, id: int=None):
        try:
            try:
                assignment = Assignment.objects.get(id=id)
            except Assignment.DoesNotExist:
                logger.error("Assignment not found")
                return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

            response = TeacherAssignmentDetailsService().get_assignment_details(assignment, request)

            return Response(response)
        except Exception as e:
            logger.error(e)
            return Response({"error": "An error occurred "}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the assignment",
            )
        ]
    )
    @action(
        detail=False,
        methods=["put"],
        url_path="update-assignment-viibility/(?P<id>[^/.]+)",
        url_name="update-assignment",
    )
    def update_assignment_visibility(self, request, id: str=None):
        assignment = Assignment.objects.get(id=id)
        assignment.is_visible = not assignment.is_visible  
        assignment.save()
        return Response(AssignmentSerializer(assignment).data, status=status.HTTP_200_OK)


    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the assignment",
            )
        ],
        responses={200: AssignmentSerializer},
    )
    @action(detail=False, methods=['put'], url_path='update-assignment/(?P<id>[^/.]+)', url_name='update-assignment')
    def update_assignment(self, request, id: int):
        assignment_title = request.data.get("title")
        assignment_description = request.data.get("description")
        deadline = request.data.get("deadline")
        start_date = request.data.get("start_date")

        try:
            assignment = Assignment.objects.get(id=id)
        except Assignment.DoesNotExist:
            logger.error("Assignment not found")
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)
        
        now = datetime.datetime.now()
        if assignment.deadline < now:
            return Response({"error": "Assignment deadline has passed"}, status=status.HTTP_400_BAD_REQUEST)

        assignment.title = assignment_title
        assignment.description = assignment_description
        assignment.deadline = parser.parse(deadline)
        assignment.start_date = parser.parse(start_date)
        assignment.save()
        return Response(AssignmentSerializer(assignment).data, status=status.HTTP_200_OK)
    

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the file assignment",
            )
        ],
        responses={204, None},
    )
    @action(detail=False, methods=['delete'], url_path='delete_assigment_file/(?P<id>[^./]+)', url_name='delete_assigment_file')
    def delete_assigment_file(self, request, id: int):
        try:
            file = AssignmentFile.objects.get(id=id)
            file.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except AssignmentFile.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(e)
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@extend_schema(tags=["ourseMateriales"])
class CourseMaterialesViewSet(viewsets.ViewSet):
    serializer_class = CourseMaterialesSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="subject_code",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Code of the subject",
            )
        ],
        responses={200: CourseMaterialesSerializer},
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="(?P<subject_code>[^/.]+)",
        url_name="course_materials",
    )
    def course_materials(self, request, subject_code: str=None):
        subject = Subject.objects.get(subject_code=subject_code)
        queryset = CourseMateriales.objects.filter(course=subject)
        serializer = CourseMaterialesSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        data = request.data
        subject_code = data["subject_code"]
        subject = get_object_or_404(Subject, subject_code=subject_code)
        file = request.FILES['file']
        course_material = CourseMateriales(pdf_file=file, course=subject)
        course_material.save()
        return Response(CourseMaterialesSerializer(course_material).data, status=status.HTTP_201_CREATED)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Code of the subject",
            )
        ],
    )
    @action(detail=False, methods=['delete'], url_path='delete/(?P<id>[^/.]+)', url_name='delete_course_material')
    def delete(self, request, id: str=None):
        queryset = CourseMateriales.objects.all()
        course_material = get_object_or_404(queryset, id=id)
        course_material.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(tags=["Announcement"])
class AnnouncementViewSet(viewsets.ViewSet):
    serializer_class = AnnouncementSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="subject_code",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Code of the subject",
            )
        ],
        responses={200: AnnouncementSerializer},
    )
    @action(detail=False, methods=['get'], url_path='subject/(?P<subject_code>[^/.]+)', url_name='announcements')
    def announcements(self, request, subject_code: str=None):
        subject = Subject.objects.get(subject_code=subject_code)
        announcement = Announcement.objects.filter(subject=subject).order_by('announcement_date')
        serializer = AnnouncementSerializer(announcement, many=True)
        return Response(serializer.data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="subject_code",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Code of the subject",
            )
        ],
        responses={200: AnnouncementSerializer},
    )
    @action(detail=False, methods=['get'], url_path='student/(?P<subject_code>[^/.]+)', url_name='announcements')
    def student_announcements(self, request, subject_code: str=None):
        subject = Subject.objects.get(subject_code=subject_code)
        announcement = Announcement.objects.filter(subject=subject, is_active=True).order_by('announcement_date')
        serializer = AnnouncementSerializer(announcement, many=True)
        return Response(serializer.data)

    def create(self, request):
        new_ammouncement = AnnouncementService(request).create_announcement()
        serializer = AnnouncementSerializer(new_ammouncement)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the announcement",
            )
        ],
        responses={200: AnnouncementSerializer},
    )
    def update(self, request, id: int=None):
        queryset = Announcement.objects.all()
        announcement = get_object_or_404(queryset, id=id)
        announcement_title = request.data.get('announcement_title')
        announcement_description = request.data.get('announcement_description')
        announcement.announcement_title = announcement_title
        announcement.announcement_description = announcement_description
        announcement.save()
        return Response(AnnouncementSerializer(announcement).data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the announcement",
            )
        ],
        responses={200: AnnouncementSerializer},
    )
    @action(detail=False, methods=['put'], url_path='active/(?P<id>[^/.]+)', url_name='chnage_active')
    def change_to_active(self, request, id: int=None):
        announcement = Announcement.objects.get(id=id)
        announcement.is_active = not announcement.is_active
        announcement.save()
        return Response(AnnouncementSerializer(announcement).data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the announcement",
            )
        ],
        responses={200: AnnouncementSerializer},
    )
    def destroy(self, request, id: int=None):
        queryset = Announcement.objects.all()
        announcement = get_object_or_404(queryset, id=id)
        announcement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  


@extend_schema(tags=["Syllabus"])
class SyllabusViewSet(viewsets.ViewSet):
    serializer_class = SyllabusSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="subject_code",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Code of the subject",
            )
        ],
        responses={201: SyllabusSerializer},
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="create/(?P<subject_code>[^/.]+)",
        url_name="create_syllabus",
    )
    def create_syllabus(self, request, subject_code=None):
        subject = get_object_or_404(Subject, subject_code=subject_code)

        try:
            syllabus = Syllabus.objects.get(course=subject)
        except Syllabus.DoesNotExist:
            syllabus = Syllabus.objects.create(course=subject)
            syllabus.save()
        data = request.data

        if isinstance(data, list):
            with transaction.atomic():
                for item in data:
                    title = item.get('section_title')
                    description = item.get('section_description')
                    syllabus_item = SyllabusItem.objects.create(section_title=title,section_description=description)
                    syllabus.syllabus_items.add(syllabus_item)
        else:
            return Response({"error": "Invalid data format"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(SyllabusSerializer(syllabus).data, status=status.HTTP_201_CREATED)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="subject_code",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Code of the subject",
            )
        ],
        responses={200: SyllabusSerializer},
    )
    @action(detail=False, methods=['get'], url_path='subject/(?P<subject_code>[^/.]+)', url_name='syllabus')
    def syllabus(self, request, subject_code=None):
        subject = get_object_or_404(Subject, subject_code=subject_code)
        syllabus = Syllabus.objects.filter(course=subject)
        if not syllabus:
            new_syllabus = Syllabus.objects.create(course=subject)
            new_syllabus.save()
            return Response(SyllabusSerializer(new_syllabus).data)
        serializer = SyllabusSerializer(syllabus, many=True)
        return Response(serializer.data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the syllabus item",
            )
        ],
        responses={200: SyllabusItemSerializer},
    )
    @action(
        detail=False,
        methods=["put"],
        url_path="update/(?P<id>[^/.]+)",
        url_name="update_syllabus",
    )
    def update_syllabus_item(self, request, id: int=None):
        queryset = SyllabusItem.objects.all()
        syllabus_item = get_object_or_404(queryset, id=id)
        syllabus_item.section_title = request.data.get('section_title')
        syllabus_item.section_description = request.data.get('section_description')
        syllabus_item.save()
        return Response(SyllabusItemSerializer(syllabus_item).data)


@extend_schema(tags=["Submission"])
class SubmissionViewSet(viewsets.ViewSet):
    serializer_class = FileSubmissionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    @action(detail=False, methods=['put'], url_path='update', url_name='update_submission')
    def update_submission(self, request):
        try:
            for item in request.data:
                submission_id = item.get("id")
                student_id = item.get("student_id")
                grade = item.get("grade")
                assignment_type = item.get("type")

            if not submission_id or not student_id or not grade or not assignment_type:
                return Response({"message": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                student = Student.objects.get(student_id=student_id)
                if assignment_type == "File":
                    submission = FileSubmission.objects.get(id=submission_id, student=student)
                elif assignment_type == "Text":
                    submission = TextSubmission.objects.get(id=submission_id, student=student)
            except ObjectDoesNotExist as e:
                return Response({"message": "Submission not found"}, status=404)

            submission.is_graded = True
            submission.grade = grade
            submission.save()
            return Response({"message": "Submission updated successfully"}, status=200)
        except Exception as e:
            logger.error(e)
            return Response({"message": "An error occurred"}, status=500)
