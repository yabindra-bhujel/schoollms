from django.utils import timezone
from student.models import Student
from .serializers import *
from rest_framework.decorators import api_view
from .models import *
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from dateutil import parser
from django.core.exceptions import ObjectDoesNotExist
import logging
from datetime import datetime
from django.utils.dateparse import parse_datetime
from django.core.files import File
import os
from .pdfcreator import PDF
from django.conf import settings
from notification.models import NotificationModel
from django.contrib.auth import get_user_model
User = get_user_model()

logger = logging.getLogger(__name__)


@api_view(["DELETE"])
def delete_course(request, id, username):
    try:
        subject = Subject.objects.get(subject_code=id)
        subject.delete()
        return Response({"message": "Course deleted successfully"}, status=200)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)

@api_view(["GET"])
def department_list(request):
    try:
        departments = Department.objects.all()
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )




@api_view(["PUT"])
def update_department(request, username, id):

    try:
        department_name = request.data.get("Department_name")
        department_code = request.data.get("Department_code")

        try:
            department = Department.objects.get(id=id)
        except Department.DoesNotExist:
            return Response(
                {"error": "Department not found"}, status=status.HTTP_404_NOT_FOUND
            )

        department.Department_name = department_name
        department.Department_code = department_code
        department.save()
        return Response({"message": "Department updated."}, status=200)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)
    



@api_view(["POST"])
def add_department(request, username):
    try:
        department_name = request.data.get("Department_name")
        department_code = request.data.get("Department_code")

        try:
            department = Department.objects.create(
                Department_name=department_name, Department_code=department_code
            )
            department.save()
            return Response({"message": "Department created."}, status=201)
        except Exception as e:
            print(e)
            return Response({"message": "An error occurred"}, status=500)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)



@api_view(["DELETE"])
def delete_department(request, id, username):
    try:
        department = Department.objects.get(id=id)
        department.delete()
        return Response({"message": "Department deleted successfully"}, status=200)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)


@api_view(["POST"])
def get_file(request):
    request_data = request.data

    course_code = request_data["subject_code"]
    subject = get_object_or_404(Subject, subject_code=course_code)

    serializer_data = {"course": subject.id, "pdf_file": request_data["file"]}
    try:
        file_serializer = CourseMaterialesSerializers(data=serializer_data)
        if not file_serializer.is_valid():
            print("Serializer Errors:", file_serializer.errors)
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file = file_serializer.save()
        return Response(
            {"message": "Assignment created successfully"},
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        print(e)
        return Response(
            {"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )




@api_view(['DELETE'])
def delete_file(request, id):
    try:
        file = CourseMateriales.objects.get(id=id)
        file.delete()
        return Response({"message": "File deleted successfully"}, status=200)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)
    


def format_iso_date(iso_date):
    try:
        date = parser.isoparse(iso_date)
        return date.strftime("%Y-%m-%d %H:%M")
    except ValueError:
        return None


@api_view(["GET"])
def student_assignment_details(request, id):
    try:
        try:
            assignment = Assignment.objects.get(id=id)
        except Assignment.DoesNotExist:
            return Response(
                {"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = AssignmentSerializer(assignment)
        response_data = serializer.data.copy()

        # remove student from response
        response_data.pop("student")
        response_data.pop("submission_count")


        # Get all question associated with this assignment
        questions = TextAssigemntQuestion.objects.filter(assignment=assignment)
        question_list = [{"id": question.id, "question": question.question} for question in questions]
        response_data["questions"] = question_list

        return Response(response_data, status=status.HTTP_200_OK)



    except Exception as e:
        print(e)
        return Response(
            {"error": "An error occurred something wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


   

@api_view(["GET"])
def assignment_details(request, id):
    try:
        try:
            assignment = Assignment.objects.get(id=id)
        except Assignment.DoesNotExist:
            return Response(
                {"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = AssignmentSerializer(assignment)
        response_data = serializer.data.copy()

        # Get all question associated with this assignment
        questions = TextAssigemntQuestion.objects.filter(assignment=assignment)
        question_list = [{"id": question.id, "question": question.question} for question in questions]
        response_data["questions"] = question_list


        posted_date_iso = serializer.data["assignment_posted_date"]
        formatted_posted_date = format_iso_date(posted_date_iso)

        assignment_deadline_iso = serializer.data["assignment_deadline"]
        formatted_assignment_deadline = format_iso_date(assignment_deadline_iso)

        if formatted_posted_date:
            response_data["formatted_posted_date"] = formatted_posted_date

        if formatted_assignment_deadline:
            response_data[
                "formatted_assignment_deadline"
            ] = formatted_assignment_deadline

        # Get text submissions for the assignment
        text_submissions = TextSubmission.objects.filter(assignment=assignment)

        # Create a list to hold text submission data
        submission_data = []
        try:
            assignment_type = serializer.data["assignment_type"]
            if assignment_type == "Text":
                 for text_submission in text_submissions:
                    student_id = text_submission.student_id
                    student = Student.objects.get(studentID=student_id)
                    submission_datetime = str(text_submission.submission_time)
                    is_submitted = text_submission.is_submited

                  
                    assignment_answer = text_submission.student_asnwer_file.url if text_submission.student_asnwer_file else None
                    if assignment_answer:
                        assignment_answer = request.build_absolute_uri(assignment_answer)

                        student_submission = {
                            "assigemnt_title": assignment.assignment_title,
                            "id": text_submission.id,
                            "student_name": f"{student.first_name} {student.last_name}",
                            "student_id": student_id,
                            "submission_datetime": format_iso_date(submission_datetime),
                            "is_submitted": is_submitted,
                            "assignment_answer": assignment_answer,
                            "type": "Text",
                            "is_graded": text_submission.is_graded,
                            "grade": text_submission.grade,
                        }
                                    
                    submission_data.append(student_submission)



            elif assignment_type == "File":
                # Process file submissions
                file_submissions = FileSubmission.objects.filter(assignment=assignment)
                file_submission_serializer = FileSubmissionSerializer(
                    file_submissions, many=True, context={"request": request}
                )

                for file_submission in file_submission_serializer.data:
                    student_id = file_submission["student"]
                    student = Student.objects.get(studentID=student_id)

                    submission_datetime = str(file_submission["submission_datetime"])
                    is_submitted = file_submission["is_submited"]
                    is_graded = file_submission["is_graded"]
                    grade = file_submission["grade"]
                    assignment_submission_file = file_submission[
                        "assignment_submission_file"
                    ]
                    student_submission = {
                        "assigemnt_title": assignment.assignment_title,
                        "id": file_submission["id"],
                        "student_name": f"{student.first_name} {student.last_name}",
                        "student_id": student_id,
                        "submission_datetime": format_iso_date(submission_datetime),
                        "is_submitted": is_submitted,
                        "assignment_submission_file_url": assignment_submission_file,
                        "type": "File",
                        "is_graded": is_graded,
                        "grade": grade,
                    }

                    submission_data.append(student_submission)
        except Exception as e:
            print(e)

        response_data["submissions"] = submission_data

        return Response(response_data)
    except Exception as e:
        print(e)
        return Response(
            {"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )




@api_view(["PUT"])
def update_submission(request):
    try:
        for item in request.data:
            submission_id = item.get("id")
            student_id = item.get("student_id")
            grade = item.get("grade")
            assignment_type = item.get("type")

        if not submission_id or not student_id or not grade or not assignment_type:
            return Response({"message": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        

        
        try:
            student = Student.objects.get(studentID=student_id)
            if assignment_type == "File":
                submission = FileSubmission.objects.get(id=submission_id, student=student)
            elif assignment_type == "Text":
                submission = TextSubmission.objects.get(id=submission_id, student=student)
        except ObjectDoesNotExist as e:
            print(e)
            return Response({"message": "Submission not found"}, status=404)
        
        submission.is_graded = True
        submission.grade = grade
        submission.save()
        return Response({"message": "Submission updated successfully"}, status=200)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)





@api_view(['DELETE'])
def delete_assigemnt_question(request, id):
    try:
        question = TextAssigemntQuestion.objects.get(id=id)
        question.delete()
        return Response({"message": "Question deleted successfully"}, status=200)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)




@api_view(["GET"])
def course_list(request, username):
    courses = Subject.objects.all()
   



    course_data = []
    for course in courses:
         teacherID = course.subject_teacher
         course_data.append(
            {
                "subject_code": course.subject_code,
                "subject_name": course.subject_name,
                "subject_description": course.subject_description,
                "weekday": course.weekday,
                "start_time": course.period_start_time,
                "end_time": course.period_end_time,
                "class_room": course.class_room,
                "class_period": course.class_period,
                "subject_teacher": teacherID.first_name + " " + teacherID.last_name,
                "subject_faculty": course.subject_faculty.Department_name,
                


            }
        )
    return Response(course_data)

@api_view(["GET"])
def course_details_student(request, subject_code, studentID):
    try:
        subject = Subject.objects.get(subject_code=subject_code)
        student = Student.objects.get(pk=studentID)
    except (Subject.DoesNotExist, Student.DoesNotExist):
        return Response(
            {"error": "Subject or Student not found"}, status=status.HTTP_404_NOT_FOUND
        )

    serializer = SubjectEnrollSerializers(subject.subjectenroll_set.all(), many=True)
    course_data = []

    for enrolled in serializer.data:
        students = enrolled["student"]
        teacher = enrolled["teacher"]

        assignments = Assignment.objects.filter(course=subject)
        course_materiales = CourseMateriales.objects.filter(course=subject)

        assignment_data = []
        for assignment in assignments:
            # Check if the student has submitted this assignment
            has_submitted = assignment.has_student_submitted(student)
            assignment_serializer = AssignmentSerializer(assignment)
            assignment_dict = assignment_serializer.data
            assignment_dict['has_submitted'] = has_submitted
            assignment_dict['is_active'] = assignment.is_active

            assignment_data.append(assignment_dict)

        course_materiales_serializer = CourseMaterialesSerializers(course_materiales, many=True, context={"request": request})

        course = {
            "id": enrolled["id"],
            "subject_code": subject.subject_code,
            "subject_name": subject.subject_name,
            "subject_description": subject.subject_description,
            "weekday": subject.weekday,
            "start_time": subject.period_start_time,
            "end_time": subject.period_end_time,
            "class_room": subject.class_room,
            "students": students,  # Add student data
            "teacher": teacher,  # Add teacher data
            "assignments": reversed(assignment_data),
            "course_materiales": reversed(course_materiales_serializer.data),

        }
        course_data.append(course)

    return Response(course_data)



@api_view(["GET"])
def course_details(request, subject_code):
    try:
        subject = Subject.objects.get(subject_code=subject_code)
    except Subject.DoesNotExist:
        return Response(
            {"error": "Subject not found"}, status=status.HTTP_404_NOT_FOUND
        )

    # Access the related SubjectEnroll instances using the subject's reverse relationship
    serializer = SubjectEnrollSerializers(subject.subjectenroll_set.all(), many=True)

    # Create a list to store the course data
    course_data = []


    for enrolled in serializer.data:
        # Get related student and teacher data from SubjectEnroll instance
        students = enrolled["student"]
        teacher = enrolled["teacher"]

        # Retrieve assignments related to this SubjectEnroll instance
        assignments = Assignment.objects.filter(course=subject)

        # Serialize assignments using AssignmentSerializer
        assignment_serializer = AssignmentSerializer(assignments, many=True)
        serialized_assignments = assignment_serializer.data  # Serialized assignment data

        # Add is_active property to each assignment
        for assignment_data in serialized_assignments:
            assignment_id = assignment_data["id"]
            assignment_instance = Assignment.objects.get(id=assignment_id)
            assignment_data["is_active"] = assignment_instance.is_active

        # Serialize course_materiales using CourseMaterialesSerializers
        course_materiales = CourseMateriales.objects.filter(course=subject)
        course_materiales_serializer = CourseMaterialesSerializers(
            course_materiales, many=True, context={"request": request}
        )
        serialized_course_materiales = course_materiales_serializer.data  # Serialized course_materiales data

        course = {
            "id": enrolled["id"],
            "subject_code": subject.subject_code,
            "subject_name": subject.subject_name,
            "subject_description": subject.subject_description,
            "weekday": subject.weekday,
            "start_time": subject.period_start_time,
            "end_time": subject.period_end_time,
            "class_room": subject.class_room,
            "students": students,
            "teacher": teacher,
            "assignments": reversed(serialized_assignments),
            "course_materiales": reversed(serialized_course_materiales),
        }
        course_data.append(course)

    return Response(course_data)




# get course takne student list
@api_view(["GET"])
def enroll_student(request):
    enroll_student = SubjectEnroll.objects.all()
    serializer = SubjectEnrollSerializers(enroll_student, many=True)
    return Response(serializer.data)



@api_view(["POST"])
def create_assigment(request):
    assigment_data = request.data
    course_code = assigment_data["course"]
    subject = get_object_or_404(Subject, subject_code=course_code)

    serializer_data = {
        "course": subject.id,
        "assignment_title": assigment_data["assignment_title"],
        "assignment_description": assigment_data["assignment_description"],
        "assignment_deadline": assigment_data["assignment_deadline"],
        "assignment_type": assigment_data["assignment_type"],
        "max_grade": assigment_data["max_grade"],
        "assignment_start_date": assigment_data["assignment_start_date"],
    }

    questions =  assigment_data.get("questions", [])


    student_ids = assigment_data["students"]

    try:
        assignment_serializer = AssignmentSerializer(data=serializer_data)
        if not assignment_serializer.is_valid():
            print("Serializer Errors:", assignment_serializer.errors)
            return Response(
                assignment_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        assignment = assignment_serializer.save()
        assignment.student.set(student_ids)



          # Create TextAssigmentQuestion instances and associate them with the assignment
        try:
            for question_data in questions:
                text_question = TextAssigemntQuestion.objects.create(question=question_data['text'])
                assignment.text_question.add(text_question)
        except Exception as e:
            print(e)




        # Create AssignmentNotificationModel instance
        try:
            notification = NotificationModel.objects.create(
                title='New Assignment',
                content=f'New assignment "{assignment.assignment_title}" has been created.',
                is_read=False
            )
           
            for username in student_ids:
                # Check if the user with the given username exists before adding it to the notification
                if User.objects.filter(username=username).exists():
                    user = User.objects.get(username=username)
                    notification.user.add(user)

                notification.user.add(user)
        except Exception as e:
            print(f"Error creating AssignmentNotificationModel: {e}")



        return Response(
            {"message": "Assignment created successfully"},
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        print(e)
        return Response(
            {"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
def file_assigment(request):
    try:
        answer_files = request.FILES.getlist("file_submission")
        assignment_id = request.data.get("assignment_id")
        student_id = request.data.get("student")
        try:
            assignment = get_object_or_404(Assignment, pk=assignment_id, is_active=True)
            student = get_object_or_404(Student, studentID=student_id)
        except ObjectDoesNotExist as e:
            print(e)
            return Response({"message": "Assignment not found"}, status=404)
        
        # Initialize submission variable
        submission = None

        # Check if a submission already exists for the same student and assignment
        existing_submission = FileSubmission.objects.filter(
            assignment=assignment, student=student
        ).first()
        if existing_submission:
            # Use the existing submission
            submission = existing_submission
            # Clear existing files associated with the submission
            existing_submission.assignment_submission_file.clear()
            existing_submission.is_submited = True
            existing_submission.save()
        else:
            # Create a new submission
            submission = FileSubmission.objects.create(
                assignment=assignment, student=student, is_submited=True
            )
            submission.save()

        # Check if submission is defined
        if submission:
            # Associate the uploaded files with the submission
            for file in answer_files:
                assignment_file = AssignmentFile(file=file)
                assignment_file.save()
                submission.assignment_submission_file.add(assignment_file)
        else:
            return Response({"message": "Submission not created"}, status=500)

        return Response({"message": "File Submission Successfully"}, status=201)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)






def ensure_directory_exists(path):
    if not os.path.exists(path):
        os.makedirs(path)


@api_view(["POST"])
def text_assignment(request):
    try:
        # Extract data from the request
        student_id = request.data.get("student")
        assignment_id = request.data.get("assignment_id")
        answers = request.data.get("answers", [])

        # Check if data is present
        if not student_id or not assignment_id or not answers:
            return Response({"message": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)

        # Get the assignment and student objects
        assignment = get_object_or_404(Assignment, pk=assignment_id)
        student = get_object_or_404(Student, studentID=student_id)

        # Check if a submission already exists for the same student and assignment
        textsubmission = TextSubmission.objects.filter(assignment=assignment, student=student).first()

        if textsubmission:
            # Update the existing submission
            textsubmission.answer.clear()  # Clear existing answers
        else:
            # Create a new submission
            textsubmission = TextSubmission.objects.create(
                assignment=assignment,
                student=student,
                is_submited=True
            )

        # Process and save answers
        for answer_data in answers:
            question_id = answer_data.get("question_id")
            answer_text = answer_data.get("answer")
            question = TextAssigemntQuestion.objects.get(id=question_id)
            text_answer = TextAnswer.objects.create(
                question_id=question_id,
                answer=answer_text
            )
            textsubmission.answer.add(text_answer)
        
        textsubmission.save()

        # Create a PDF file for the assignment
        filename = f"{student.studentID}.pdf"
        assigemnt_title = assignment.assignment_title
        current_date = datetime.now().strftime("%Y-%m-%d")
        full_name = f"{student.first_name} {student.last_name}"
        question_answers = [
            {"question": answer.question.question, "answer": answer.answer}
            for answer in textsubmission.answer.all()
        ]

         # Add PDF file to submission directory
        media_dir = 'student_asnwer_file'
        media_base = settings.MEDIA_ROOT 
        ensure_directory_exists(os.path.join(media_base, media_dir))

        # Construct the file path 
        pdf_path = os.path.join(media_base, media_dir, filename)

        # Create and write to the PDF
        pdf = PDF(filename=pdf_path, title=assigemnt_title, username=full_name, date=current_date, student_id=student.studentID)
        pdf.add_header()
        for question_answer in question_answers:
            pdf.add_text("質問: " + question_answer["question"])
            pdf.add_text("回答: " + question_answer["answer"])
        pdf.save()

        # Update the submission with the PDF path
        relative_pdf_path = os.path.join(media_dir, filename)
        textsubmission.student_asnwer_file = relative_pdf_path      
        textsubmission.save()

        # Update the submission count for the assignment
        assignment.submission_count = TextSubmission.objects.filter(assignment=assignment, is_submited=True).count()
        assignment.save()

        return Response({"message": "OK"}, status=200)

    except Exception as e:
        print(e)
        return Response({"message": "An error occurred something wrong"}, status=500)








@api_view(["POST"])
def upadteAssigemnt(request):
    try:
        assignment_id = request.data.get("id")
        assignment_title = request.data.get("assignment_title")
        assignment_description = request.data.get("assignment_description")
        assignment_deadline = request.data.get("assignment_deadline")


        try:
            assignment = Assignment.objects.get(id=assignment_id)
        except Assignment.DoesNotExist:
            return Response(
                {"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND
            )
        
        assignment_deadline = parse_datetime(assignment_deadline)

        assignment.assignment_title = assignment_title
        assignment.assignment_description = assignment_description
        assignment.assignment_deadline = assignment_deadline
        assignment.save()
        return Response({"message": "Assigemnt updated."}, status=200)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)
    




# TODO: write Test
@api_view(["GET"])
def get_all_assignment(request, username):
    try:
        assignments = Assignment.objects.filter(student__user__username=username)
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)


# TODO: write Test
@api_view(["GET"])
def get_active_assigemnt(request, username):
    try:
        assignments = Assignment.objects.filter(
            student__user__username=username, is_active=True
        )
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)


# TODO: write Test
@api_view(["GET"])
def get_past_assigemnt(request, username):
    try:
        current_time = timezone.now()
        assignments = Assignment.objects.filter(
            student__user__username=username,
            is_active=False,
            assignment_deadline__lte=current_time,
        )
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)


# TODO: write Test
@api_view(["GET"])
def get_future_assigemnt(request, username):
    try:
        current_time = timezone.now()
        assignments = Assignment.objects.filter(
            student__user__username=username,
            is_active=False,
            assignment_deadline__gt=current_time,
        )
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)




@api_view(["POST"])
def create_attendance(request):
    try:
        course_code = request.data.get("course_code")
        teacher_id = request.data.get("teacher_id")

        try:
            course = Subject.objects.get(subject_code=course_code)
            teacher = Teacher.objects.get(TeacherID=teacher_id)
            subject_enrolls = course.subjectenroll_set.all()
            subject_enroll_instance = subject_enrolls.first()


        except ObjectDoesNotExist as e:
            logger.error("Course or teacher not found")
            return Response({"message": "Course or teacher not found"}, status=404)
        
        # Create attendance object
        try:
            attendance = Attendance.objects.create(course=course, subject_enroll=subject_enroll_instance)
            attendance.save()
        except Exception as e:
            print(e)
            logger.error("An error occurred")
            return Response({"message": "An error occurred"}, status=500)
        

        # get attdence object and return it
        attendance_serializer = AttendanceSerializer(attendance)
        response_data = attendance_serializer.data.copy()


        # fatch student data
        students_attended_ids = response_data.get("students_attended", [])

        students_attended = []
        for student_attended_id in students_attended_ids:
            try:
                # Fetch the StudentAttended object
                student_attended = StudentAttended.objects.get(id=student_attended_id)

                # Serialize the student attendance data
                student_attended_data = {
                    "student_id": student_attended.student.studentID,
                    "student_name": f"{student_attended.student.first_name} {student_attended.student.last_name}",
                    "is_present": student_attended.is_present,
                }
                
                students_attended.append(student_attended_data)

            except StudentAttended.DoesNotExist:
                logger.error("StudentAttended attendance not found")
                return Response({"message": "StudentAttended attendance not found"}, status=404)

        response_data["students_attended"] = students_attended
        


            
        return Response({"message": "Attendance object cretaed",
                            "attendance": response_data
                         }, status=200)
    except Exception as e:
        print(e)
        logger.error("An error occurred")
        return Response({"message": "An error occurred"}, status=500)




@api_view(['POST'])
def mark_attendance(request):

    try:
        attendance_code = request.data.get('attendance_code')
        student_id = request.data.get('student_id')
        if not attendance_code or not student_id:
            return Response({"message": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            
            student = Student.objects.get(studentID=student_id)
        except ObjectDoesNotExist as e:
            logger.error("Student not found") 
            return Response({"message": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # check if attendance exists
        try:
            attendance = Attendance.objects.get(attendance_code=attendance_code)
        except ObjectDoesNotExist as e:
            logger.error("Attendance not found") 
            return Response({"message": "Attendance not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # check requested student is in the course
        try:
            course = attendance.course
            subject_enroll = SubjectEnroll.objects.get(course=course, student=student)
        except ObjectDoesNotExist as e:
            logger.error("Student not enrolled in the course") 
            return Response({"message": "Student is not enrolled in the course"}, status=status.HTTP_404_NOT_FOUND)
        
       # Check if the student has already marked attendance
        alrady_marked = StudentAttended.objects.filter(student=student, attendance_code=attendance_code, is_present = True).exists()
        if alrady_marked:
            return Response({"message": "Attendance already marked"}, status=status.HTTP_200_OK)
        else:
            # Edit student attendance if it exists
            try:
                student_attended = StudentAttended.objects.get(student=student, attendance_code=attendance_code)
                # Update is_present to True
                student_attended.is_present = True
                student_attended.save()
                return Response({"message": "Attendance marked successfully"}, status=status.HTTP_201_CREATED)
            except ObjectDoesNotExist as e:
                logger.error("Student attendance not found") 
                return Response({"message": "Attendance not found"}, status=status.HTTP_404_NOT_FOUND)

                 
    except Exception as e:
        logger.error("An error occurred") 
        return Response({"message": f"An error occurred{e}",}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_attendance_by_subject(request, subject_code):
    try:
        subject = get_object_or_404(Subject, subject_code=subject_code)

        enroll_student = SubjectEnroll.objects.filter(course=subject)
        serializer = SubjectEnrollSerializers(enroll_student, many=True)

        student_ids = [student['Student_id'] for enroll_student in serializer.data for student in enroll_student['student']]
        students = Student.objects.filter(studentID__in=student_ids)

        student_list = []
        for student in students:
            student_data = {
                "student_id": student.studentID,
                "full_name": f"{student.first_name} {student.last_name}",
                "course": subject.subject_name,
            }
            student_list.append(student_data)

        attendance = Attendance.objects.filter(course=subject)
        attendance_serializer = AttendanceSerializer(attendance, many=True)

        attendance_data = []
        for att in attendance:
            # Fetch the course name
            course_name = att.course.subject_name  # Assuming your Course model has a 'name' field

            students_attended = []
            for student_attended in att.students_attended.all():
                student_attended_data = {
                    "student_id": student_attended.student.studentID,
                    "full_name": f"{student_attended.student.first_name} {student_attended.student.last_name}",
                    "is_present": student_attended.is_present,
                }
                students_attended.append(student_attended_data)

            attendance_data.append({
                "id": att.id,
                "date": att.date,
                "attendance_code": att.attendance_code,
                "is_active": att.is_active,
                "course": course_name,  # Include course name here
                "subject_enroll": att.subject_enroll.id,
                "students_attended": students_attended
            })

        if attendance_data:
            return Response({"message": "OK", "attendance": attendance_data}, status=200)
        else:
            return Response({"message": "OK", "student_list": student_list}, status=200)

    except Exception as e:
        logger.error("An error occurred: %s", e) 
        return Response({"message": "An error occurred"}, status=500)




@api_view(['GET'])
def get_attendance_by_student_subject(request, studentID, subjectID):
    try:
        try:
            student = Student.objects.get(studentID=studentID)
            course = Subject.objects.get(subject_code=subjectID)
        except ObjectDoesNotExist as e:
            logger.error("Student not found")
            return Response({"message": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get all attendance objects for the student
        attendance = Attendance.objects.filter(students_attended__student=student, course=course)
        attendance_serializer = AttendanceSerializer(attendance, many=True)

        response_data = []

        # Iterate through each course attendance
        for attendance_data in attendance_serializer.data:
            # Get course instance
            course_instance = Subject.objects.get(id=attendance_data['course'])
            course_serializer = SubjectSerializer(course_instance)
            subject_name = course_serializer.data.get('subject_name')

            # Get student_attended instances for the current course
            student_attended_instances = StudentAttended.objects.filter(
                student=student,
                attendance__id=attendance_data['id'],
            )

            # Populate response_data list with transformed data
            for student_attended_data in student_attended_instances.values():
                transformed_data = {
                    'course': subject_name,
                    'is_present': student_attended_data.get('is_present'),
                    'attendance_code': student_attended_data.get('attendance_code'),
                    'date': str(attendance_data.get('date')),  # Convert date to string
                }
                response_data.append(transformed_data)

        # Return the response
        return Response({"message": "Ok", "attendance": response_data}, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response({"message": f"An error occurred {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['GET'])
def get_student_list_by_subject_id(request, subject_code):
    try:
        subject = Subject.objects.get(subject_code=subject_code)
        enroll_student = SubjectEnroll.objects.filter(course=subject)
        serializer = SubjectEnrollSerializers(enroll_student, many=True)


        student_ids = [student['Student_id'] for enroll_student in serializer.data for student in enroll_student['student']]
        students = Student.objects.filter(studentID__in=student_ids)
       
        
        student_list = []
        for student in students:
            student_data = {
                "student_id": student.studentID,
                "full_name": f"{student.first_name} {student.last_name}",
                }
            student_list.append(student_data)

        return Response({"message": "OK", "student_list": student_list}, status=200)
    except ObjectDoesNotExist as e:
        logger.error("Subject not found") 
        return Response({"message": "Subject not found"}, status=404)
    except Exception as e:
        logger.error("An error occurred") 
        print(e)
        return Response({"message": "An error occurred"}, status=500)


@api_view(['POST'])
def create_attdenace_and_add_student(request):
    try:
        data = request.data
        subject_code = data.get('course_id')
        student_list = data.get('studentIds')

        try:
            subject = Subject.objects.get(subject_code=subject_code)
            enroll_students = SubjectEnroll.objects.filter(course=subject)


            # Create attendance object
            try:
                attendance = Attendance.objects.create(course=subject, subject_enroll=enroll_students.first())
                attendance.save()
            except Exception as e:
                print(e)
                logger.error("An error occurred")
                return Response({"message": "An error occurred"}, status=500)
            


            selected_student_ids = [student_id for student_id, is_selected in student_list.items() if is_selected]

            for student_id in selected_student_ids:
                student = Student.objects.get(studentID=student_id)
                student_attended = StudentAttended.objects.get(student=student, attendance=attendance)
                student_attended.is_present = True
                student_attended.save()

            # get all student id from enroll_student
        except ObjectDoesNotExist as e:
            logger.error("Subject not found") 
            return Response({"message": "Subject not found"}, status=404)
        return Response(status=200)

    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)
    


@api_view(['GET'])
def get_attendance_by_student(request, student_id):
    try:
        try:
            student = Student.objects.get(studentID=student_id)
        except ObjectDoesNotExist as e:
            logger.error("Student not found")
            return Response({"message": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get all attendance objects for the student
        attendance = Attendance.objects.filter(students_attended__student=student)
        attendance_serializer = AttendanceSerializer(attendance, many=True)

        response_data = []

        # Iterate through each course attendance
        for attendance_data in attendance_serializer.data:
            # Get course instance
            course_instance = Subject.objects.get(id=attendance_data['course'])
            course_serializer = SubjectSerializer(course_instance)
            subject_name = course_serializer.data.get('subject_name')

            # Get student_attended instances for the current course
            student_attended_instances = StudentAttended.objects.filter(
                student=student,
                attendance__id=attendance_data['id'],
            )

            # Populate response_data list with transformed data
            for student_attended_data in student_attended_instances.values():
                transformed_data = {
                    'course': subject_name,
                    'is_present': student_attended_data.get('is_present'),
                    'attendance_code': student_attended_data.get('attendance_code'),
                    'date': str(attendance_data.get('date')),  # Convert date to string
                }
                response_data.append(transformed_data)

        # Return the response
        return Response({"message": "Ok", "data": response_data}, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response({"message": f"An error occurred {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
def AddAnnouncement(request):
    try:
        subject_code = request.data.get('subject_code')
        title = request.data.get('title')
        content = request.data.get('content')
        file = request.FILES.getlist('file')





        try:
            subject = Subject.objects.get(subject_code=subject_code)
            enroll_students = SubjectEnroll.objects.filter(course=subject)
            student_ids = enroll_students.values_list('student', flat=True)
            students = Student.objects.filter(studentID__in=student_ids)
            


        except ObjectDoesNotExist as e:
            logger.error("Subject not found") 
            return Response({"message": "Subject not found"}, status=404)
        
        try:
            announcement = Announcement.objects.create(course=subject,
                                                        announcement_title=title,
                                                          announcement_description=content)
            announcement.save()


            # Add files to the announcement
            for file in file:
                announcement_file = AnnouncementFile(file=file)
                announcement_file.save()
                announcement.announcement_file_url.add(announcement_file)


            # Create AnnouncementNotificationModel instance
            try:
                notification = NotificationModel.objects.create(
                    title='New Announcement',
                    content=f'New announcement "{announcement.announcement_title}" has been created.',
                )
                   
                for username in student_ids:
                    # Check if the user with the given username exists before adding it to the notification
                    if User.objects.filter(username=username).exists():
                        user = User.objects.get(username=username)
                        notification.user.add(user)

                    notification.user.add(user)

            except Exception as e:
                print(f"Error creating AnnouncementNotificationModel: {e}")

        except Exception as e:
            print(e)
            logger.error("An error occurred")
            return Response({"message": "An error occurred"}, status=500)
   
        return Response({"message": "OK"}, status=200)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)




@api_view(['GET'])
def get_announcement_by_subject(request, subject_code):
    try:
        subject = Subject.objects.get(subject_code=subject_code)
        announcement = Announcement.objects.filter(course=subject).order_by('announcement_date')
        serializer = AnnouncementSerializer(announcement, many=True, context={'request': request})
        return Response(serializer.data, status=200)
    except ObjectDoesNotExist as e:
        logger.error("Subject not found") 
        return Response({"message": "Subject not found"}, status=404)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)
    


@api_view(['GET'])
def get_announcement_by_subject_student(request, subject_code):
    try:
        subject = Subject.objects.get(subject_code=subject_code)
        announcement = Announcement.objects.filter(course=subject, is_active=True).order_by('announcement_date')
        serializer = AnnouncementSerializer(announcement, many=True, context={'request': request})
        return Response(serializer.data, status=200)
    except ObjectDoesNotExist as e:
        logger.error("Subject not found") 
        return Response({"message": "Subject not found"}, status=404)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)
    



@api_view(['GET'])
def get_announcement_by_student(request, studentid):
    try:
        student = Student.objects.get(studentID=studentid)
        subject_enroll = SubjectEnroll.objects.filter(student=student)
        announcement = Announcement.objects.filter(course__in=subject_enroll.values_list('course', flat=True))
        serializer = AnnouncementSerializer(announcement, many=True, context={'request': request})
        return Response(serializer.data, status=200)
    except ObjectDoesNotExist as e:
        logger.error("Subject not found") 
        return Response({"message": "Subject not found"}, status=404)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)



@api_view(['PUT'])
def handle_active_change_announcement(request, id):
    try:
        announcement = Announcement.objects.get(id=id)
        announcement.is_active = not announcement.is_active
        announcement.save()
        return Response({"message": "OK"}, status=200)
    except ObjectDoesNotExist as e:
        logger.error("Announcement not found") 
        return Response({"message": "Announcement not found"}, status=404)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)


@api_view(['DELETE'])
def delete_announcement(request, id):
    try:
        announcement = Announcement.objects.get(id=id)
        announcement.delete()
        return Response({"message": "OK"}, status=200)
    except ObjectDoesNotExist as e:
        logger.error("Announcement not found") 
        return Response({"message": "Announcement not found"}, status=404)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)


@api_view(['PUT'])
def update_announcement(request, id):
    try:
        announcement = Announcement.objects.get(id=id)
        announcement_title = request.data.get('announcement_title')
        announcement_description = request.data.get('announcement_description')
        announcement.announcement_title = announcement_title
        announcement.announcement_description = announcement_description
        announcement.save()
        return Response({"message": "OK"}, status=200)
    except ObjectDoesNotExist as e:
        logger.error("Announcement not found") 
        return Response({"message": "Announcement not found"}, status=404)
    except Exception as e:
        print(e)
        return Response({"message": "An error occurred"}, status=500)