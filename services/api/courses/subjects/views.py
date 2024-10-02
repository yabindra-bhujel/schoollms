from datetime import datetime
from django.shortcuts import get_object_or_404
from .services.assigmment.create_assigment import CreateAssignment
from .services.student_subject import StduentSubjectService
from .services.subject_registration import SubjectRegisterService
from .models import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
User = get_user_model()
from rest_framework import viewsets
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from .services.subject_service import SubjectService
from .serializers import *
from .services.teacher_subject import TeacherSubjectService
from .services.announcement import AnnouncementService
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from dateutil import parser
from django.utils.timezone import make_aware
import os
from django.conf import settings
from utils.pdf_generator import PDFGenerator


class AdminSubjectViewSet(viewsets.ViewSet):
    serializer_class = SubjectSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(responses={200: SubjectSerializer})
    def list(self, request):
        queryset = Subject.objects.all()
        serializer = SubjectSerializer(queryset, many=True)
        return Response(serializer.data)
    

    @extend_schema(responses={200: SubjectSerializer})
    @action(detail=False, methods=['get'], url_path='(?P<subject_code>[^/.]+)', url_name='subject_detail')
    def subject_detail(self, request, subject_code=None):
        queryset = Subject.objects.all()
        subject = get_object_or_404(queryset, subject_code=subject_code)
        serializer = SubjectSerializer(subject)
        return Response(serializer.data)
    
    @extend_schema(responses={201: SubjectSerializer})
    def create(self, request):
        new_subject = SubjectService(request.data).create_subject()
        if 'error' in new_subject:
            return Response(new_subject, status=status.HTTP_400_BAD_REQUEST)
        return Response(new_subject, status=status.HTTP_201_CREATED)

    @extend_schema(responses={200: SubjectSerializer})
    def update(self, request, pk=None):
        queryset = Subject.objects.all()
        subject = get_object_or_404(queryset, pk=pk)
        serializer = SubjectSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(responses={204: None})
    def destroy(self, request, pk=None):
        queryset = Subject.objects.all()
        subject = get_object_or_404(queryset, pk=pk)
        subject.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class SubjectRegistrationViewSet(viewsets.ViewSet):
    serializer_class = SubjectRegistrationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(responses={200: SubjectRegistrationSerializer})
    def list(self, request):
        queryset = SubjectRegistration.objects.all()
        serializer = SubjectRegistrationSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @extend_schema(responses={200: SubjectRegistrationSerializer})
    def retrieve(self, request, pk=None):
        queryset = SubjectRegistration.objects.all()
        registration = get_object_or_404(queryset, pk=pk)
        serializer = SubjectRegistrationSerializer(registration)
        return Response(serializer.data)
    
    @extend_schema(responses={201: SubjectRegistrationSerializer})
    def create(self, request):
        new_registration = SubjectRegisterService(request.data).register()
        return Response(SubjectRegistrationSerializer(new_registration).data, status=status.HTTP_201_CREATED)

    
    @extend_schema(responses={200: SubjectRegistrationSerializer})
    def update(self, request, pk=None):
        queryset = SubjectRegistration.objects.all()
        registration = get_object_or_404(queryset, pk=pk)
        serializer = SubjectRegistrationSerializer(registration, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(responses={204: None})
    def destroy(self, request, pk=None):
        queryset = SubjectRegistration.objects.all()
        registration = get_object_or_404(queryset, pk=pk)
        registration.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class StudentSubjectViewSet(viewsets.ViewSet):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200})
    def retrieve(self, request, pk=None):
        stduent_subject = StduentSubjectService(pk, request.user.username).get_student_subject()
        return Response(stduent_subject)

class TeacherSubjectViewSet(viewsets.ViewSet):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200})
    def retrieve(self, request, pk=None):
        teacher_subject = TeacherSubjectService(pk, request.user.username).get_teacher_subject()
        return Response(teacher_subject)

class AssigmentViewSet(viewsets.ViewSet):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: AssignmentSerializer(many=True)}, description='Get all assignments based on subject code and logged-in user')
    @action(detail=False, methods=['get'], url_path='assignment-list/(?P<subject_code>[^/.]+)', url_name='assignment_list')
    def assignment_list(self, request, subject_code=None):
        queryset = Assignment.objects.filter(course__subject_code=subject_code)
        serializer = AssignmentSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @extend_schema(responses={200: AssignmentSerializer}, description='Get assignment details based on assignment id')
    @action(detail=False, methods=['get'], url_path='student-assignment/(?P<subject_code>[^/.]+)', url_name='assignment_detail')
    def assignment_detail_stduent(self, request, subject_code=None):
        user = User.objects.get(username=request.user.username)
        student = Student.objects.get(user=user)
        subject = Subject.objects.get(subject_code=subject_code)

        registrations = SubjectRegistration.objects.filter(subject=subject)
        serializer = SubjectRegistrationSerializer(registrations, many=True)

        assignment_data = []

        for registration in serializer.data:
            assignments = Assignment.objects.filter(course=subject, is_published=True)

            for assignment in assignments:
                has_submitted = assignment.has_student_submitted(student)
                assignment_serializer = AssignmentSerializer(assignment)
                assignment_dict = assignment_serializer.data
                assignment_dict['has_submitted'] = has_submitted
                assignment_dict['is_active'] = assignment.is_active
                assignment_data.append(assignment_dict)

        return Response(assignment_data)

    @extend_schema(responses={201})
    def create(self, request):
        new_assignment = CreateAssignment(request.data).create_assignment()
        return Response(new_assignment,  status=status.HTTP_201_CREATED)

    @extend_schema(responses={200: AssignmentSerializer})
    @action(detail=False, methods=['get'], url_path='student-assignment-detail/(?P<pk>[^/.]+)', url_name='assignment_detail')
    def student_assignment_detail(self, request, pk=None):
            user = User.objects.get(username=request.user.username)
            student = Student.objects.get(user=user)
            assignment = Assignment.objects.get(pk=pk)

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
                    file_submission_data = {"id": file_submission.id, "files": []}
                    for file in file_submission.assignment_submission_file.all():
                        file_submission_data["files"].append(file.file.url)
                    response_data["file_submissions"].append(file_submission_data)

            return Response(response_data, status=status.HTTP_200_OK)
 
    def __ensureDirectoryExists(self, path):
        if not os.path.exists(path):
            os.makedirs(path)
            
    @extend_schema(responses={200: AssignmentSerializer})
    @action(detail=False, methods=['post'], url_path='create-text-assignment', url_name='create-text-assignment')
    def create_text_assignment(self, request):
            student_id = request.data.get("student")
            assignment_id = request.data.get("assignment_id")
            answers = request.data.get("answers", [])

            if not student_id or not assignment_id or not answers:
                return Response({"error": "Invalid data format"}, status=status.HTTP_400_BAD_REQUEST)
            assignment = get_object_or_404(Assignment, pk=assignment_id)
            student = get_object_or_404(Student, student_id=student_id)

            textsubmission = TextSubmission.objects.filter(assignment=assignment, student=student).first()

            if textsubmission:
                textsubmission.answers.clear()
            else:
                textsubmission = TextSubmission.objects.create(assignment=assignment, student=student, is_submitted=True)

            for answer_data in answers:
                question_id = answer_data.get("question_id")
                answer_text = answer_data.get("answer")
                question = TextAssigemntQuestion.objects.get(id=question_id)
                text_answer = TextQuestionAnswer.objects.create(
                    question_id=question_id,
                    answer=answer_text)
                textsubmission.answers.add(text_answer)
            textsubmission.save()

            filename = f"{student.student_id}.pdf"
            assignment_title = assignment.title
            current_date = datetime.now().strftime("%Y-%m-%d")
            full_name = f"{student.first_name} {student.last_name}"
            question_answers = [
                {"question": answer.question.question, "answer": answer.answer}
                for answer in textsubmission.answers.all()
            ]

            media_dir = f"text_assignments/{assignment_title}/"
            media_base_dir = settings.MEDIA_ROOT
            self.__ensureDirectoryExists(os.path.join(media_base_dir, media_dir))
            pdf_file_path = os.path.join(media_base_dir, media_dir, filename)

            pdf = PDFGenerator(filename=pdf_file_path, title=assignment_title, student_name = full_name, date=current_date, student_id=student.student_id)
            pdf.pdf_header()
            for question_answer in question_answers:
                pdf.add_text(question_answer["question"])
                pdf.add_text(question_answer["answer"])
            pdf.save()

            relative_pdf_path = os.path.join(media_dir, filename)
            textsubmission.student_answer_file = relative_pdf_path
            textsubmission.save()

            assignment.submission_count = TextSubmission.objects.filter(assignment=assignment, is_submitted=True, student=student).count()
            assignment.save()
            return Response(status=status.HTTP_200_OK)

    @extend_schema(responses={200: AssignmentSerializer})
    @action(detail=False, methods=['post'], url_path='create-file-assignment', url_name='create-file-assignment')
    def create_file_assignment(self, request):
        answer_files = request.FILES.getlist("file_submission")
        assignment_id = request.data.get("assignment_id")
        student_id = request.data.get("student")

        try:
            assignment = get_object_or_404(Assignment, pk=assignment_id)
            student = get_object_or_404(Student, student_id=student_id)
        except ObjectDoesNotExist as e:
            return Response({"message": "Assignment not found"}, status=404)

        media_dir = f"file_assignments/{assignment.title}/"
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
            return Response({"message": "Submission not found"}, status=404)
        
        assignment.submission_count = FileSubmission.objects.filter(assignment=assignment, is_submited=True).count()
        assignment.save()
        return Response(status=status.HTTP_200_OK)


    @extend_schema(responses={200: AssignmentSerializer})
    @action(detail=False, methods=['get'], url_path='teacher-assignment-detail/(?P<pk>[^/.]+)', url_name='teacher-assignment-detail')
    def teacher_assignment_detail(self, request, pk=None):
        try:
            try:
                assignment = Assignment.objects.get(pk=pk)
            except Assignment.DoesNotExist:
                return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = AssignmentSerializer(assignment)
            response_data = serializer.data.copy()


           # Get all questions associated with this assignment
            questions = assignment.questions.all()
            question_list = [{"id": question.id, "question": question.question} for question in questions]
            response_data["questions"] = question_list

            posted_date_iso = serializer.data["posted_date"]
            formatted_posted_date =self.__formatIsoDate(posted_date_iso)

            assignment_deadline_iso = serializer.data["deadline"]
            formatted_assignment_deadline = self.__formatIsoDate(assignment_deadline_iso)

            if formatted_posted_date:
                response_data["formatted_posted_date"] = formatted_posted_date

            if formatted_assignment_deadline:
                response_data["formatted_assignment_deadline"] = formatted_assignment_deadline


            text_submissions = TextSubmission.objects.filter(assignment=assignment)

            submission_data = []
            if assignment.assigment_type == Assignment.AssignmentType.TEXT:
                for text_submission in text_submissions:
                    student_id = text_submission.student_id
                    student = Student.objects.get(student_id=student_id)
                    submission_datetime = str(text_submission.submission_time)
                    is_submitted = text_submission.is_submitted

                    assignment_answer = text_submission.student_answer_file.url if text_submission.student_answer_file else None
                    if assignment_answer:
                        assignment_answer = request.build_absolute_uri(assignment_answer)

                        student_submission = {
                            "assigemnt_title": assignment.title,
                            "id": text_submission.id,
                            "student_name": f"{student.first_name} {student.last_name}",
                            "student_id": student_id,
                            "submission_datetime": self.__formatIsoDate(submission_datetime),
                            "is_submitted": is_submitted,
                            "assignment_answer": assignment_answer,
                            "type": "Text",
                            "is_graded": text_submission.is_graded,
                            "grade": text_submission.grade,
                            }
                        submission_data.append(student_submission)

            elif assignment.assigment_type == Assignment.AssignmentType.FILE:

                file_submissions = FileSubmission.objects.filter(assignment=assignment)
                file_submission_serializer = FileSubmissionSerializer(file_submissions, many=True, context={"request": request})

                for file_submission in file_submission_serializer.data:
                    student_id = file_submission["student"]
                    student = Student.objects.get(student_id=student_id)

                    submission_datetime = str(file_submission["submission_datetime"])
                    is_submitted = file_submission["is_submited"]
                    is_graded = file_submission["is_graded"]
                    grade = file_submission["grade"]
                    assignment_submission_file = file_submission["assignment_submission_file"]
                    student_submission = {
                        "assigemnt_title": assignment.title,
                        "id": file_submission["id"],
                        "student_name": f"{student.first_name} {student.last_name}",
                        "student_id": student_id,
                        "submission_datetime":self.__formatIsoDate(submission_datetime),
                        "is_submitted": is_submitted,
                        "assignment_submission_file_url": assignment_submission_file,
                        "type": "File",
                        "is_graded": is_graded,
                        "grade": grade,
                        }
                    submission_data.append(student_submission)

            response_data["submissions"] = submission_data

            return Response(response_data)
        except Exception as e:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(responses={200: AssignmentSerializer})
    @action(detail=False, methods=['put'], url_path='update-assignment-viibility/(?P<pk>[^/.]+)', url_name='update-assignment')
    def update_assignment_visibility(self, request, pk=None):
        assignment = Assignment.objects.get(pk=pk)
        assignment.is_visible = not assignment.is_visible  
        assignment.save()
        return Response(AssignmentSerializer(assignment).data, status=status.HTTP_200_OK)

    def __formatIsoDate(self, iso_date):
        try:
            date = parser.isoparse(iso_date)
            return date.strftime("%Y-%m-%d %H:%M")
        except ValueError:
            return None
    
    @extend_schema(responses={200: AssignmentSerializer})
    @action(detail=False, methods=['put'], url_path='update-assignment/(?P<pk>[^/.]+)', url_name='update-assignment')
    def update_assignment(self, request, pk=None):
        assignment_id = request.data.get("id")
        assignment_title = request.data.get("title")
        assignment_description = request.data.get("description")

        try:
            assignment = Assignment.objects.get(id=assignment_id)
        except Assignment.DoesNotExist:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)
        
        assignment.title = assignment_title
        assignment.description = assignment_description
        assignment.save()
        return Response(AssignmentSerializer(assignment).data, status=status.HTTP_200_OK)
        
class CourseMaterialesViewSet(viewsets.ViewSet):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: CourseMaterialesSerializer(many=True)}, description='Get all course materials based on subject code and logged-in user')
    @action(detail=False, methods=['get'], url_path='(?P<subject_code>[^/.]+)', url_name='course_materials')
    def course_materials(self, request, subject_code=None):
        subject = Subject.objects.get(subject_code=subject_code)
        queryset = CourseMateriales.objects.filter(course=subject)
        serializer = CourseMaterialesSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @extend_schema(responses={201}, description='Create course materials')
    def create(self, request):
        data = request.data
        subject_code = data["subject_code"]
        subject = get_object_or_404(Subject, subject_code=subject_code)
        file = request.FILES['file']
        course_material = CourseMateriales(pdf_file=file, course=subject)
        course_material.save()
        return Response(CourseMaterialesSerializer(course_material).data, status=status.HTTP_201_CREATED)
    
    @extend_schema(responses={204}, description='delete course materials')
    @action(detail=False, methods=['delete'], url_path='delete/(?P<pk>[^/.]+)', url_name='delete_course_material')
    def delete(self, request, pk=None):
        queryset = CourseMateriales.objects.all()
        course_material = get_object_or_404(queryset, pk=pk)
        course_material.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AnnouncementViewSet(viewsets.ViewSet):
    serializer_class = AnnouncementSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: AnnouncementSerializer(many=True)}, description='Get all announcements based on subject code ')
    @action(detail=False, methods=['get'], url_path='subject/(?P<subject_code>[^/.]+)', url_name='announcements')
    def announcements(self, request, subject_code=None):
        subject = Subject.objects.get(subject_code=subject_code)
        announcement = Announcement.objects.filter(subject=subject).order_by('announcement_date')
        serializer = AnnouncementSerializer(announcement, many=True)
        return Response(serializer.data)
    
    @extend_schema(responses={200: AnnouncementSerializer(many=True)}, description='Get all announcements based on subject code ')
    @action(detail=False, methods=['get'], url_path='student/(?P<subject_code>[^/.]+)', url_name='announcements')
    def student_announcements(self, request, subject_code=None):
        subject = Subject.objects.get(subject_code=subject_code)
        announcement = Announcement.objects.filter(subject=subject, is_active=True).order_by('announcement_date')
        serializer = AnnouncementSerializer(announcement, many=True)
        return Response(serializer.data)

    @extend_schema(responses={201: AnnouncementSerializer})
    def create(self, request):
        new_ammouncement = AnnouncementService(request).create_announcement()
        serializer = AnnouncementSerializer(new_ammouncement)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, pk=None):
        queryset = Announcement.objects.all()
        announcement = get_object_or_404(queryset, pk=pk)
        announcement_title = request.data.get('announcement_title')
        announcement_description = request.data.get('announcement_description')
        announcement.announcement_title = announcement_title
        announcement.announcement_description = announcement_description
        announcement.save()
        return Response(AnnouncementSerializer(announcement).data)
    
    @extend_schema(responses={200: AnnouncementSerializer})
    @action(detail=False, methods=['put'], url_path='active/(?P<pk>[^/.]+)', url_name='chnage_active')
    def change_to_active(self, request, pk=None):
        announcement = Announcement.objects.get(pk=pk)
        announcement.is_active = not announcement.is_active
        announcement.save()
        return Response(AnnouncementSerializer(announcement).data)
    

    def destroy(self, request, pk=None):
        queryset = Announcement.objects.all()
        announcement = get_object_or_404(queryset, pk=pk)
        announcement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  
    

class SyllabusViewSet(viewsets.ViewSet):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(parameters=[{'name': 'id', 'in': 'query', 'type': 'integer'}])
    @extend_schema(responses={201: SyllabusSerializer})
    @action(detail=False, methods=['post'], url_path='create/(?P<subject_code>[^/.]+)', url_name='create_syllabus')
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
    
    @extend_schema(responses={200: SyllabusSerializer})
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
    
    @extend_schema(responses={200: SyllabusSerializer})
    @action(detail=False, methods=['put'], url_path='update/(?P<pk>[^/.]+)', url_name='update_syllabus')
    def update_syllabus_item(self, request, pk=None):
        queryset = SyllabusItem.objects.all()
        syllabus_item = get_object_or_404(queryset, pk=pk)
        syllabus_item.section_title = request.data.get('section_title')
        syllabus_item.section_description = request.data.get('section_description')
        syllabus_item.save()
        return Response(SyllabusItemSerializer(syllabus_item).data)
    
class SubmissionViewSet(viewsets.ViewSet):
    serializer_class = FileSubmissionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200})
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
            return Response({"message": "An error occurred"}, status=500)
