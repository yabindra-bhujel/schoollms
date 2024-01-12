from courses.models import Subject, SubjectEnroll
from student.models import Student
from student.serializers import StudentSerializer
from teacher.models import Teacher
from .serializer import *
from .models import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.decorators import api_view
from notification.models import NotificationModel
from django.contrib.auth import get_user_model
User = get_user_model()



class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_teacher
    
class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_student
    


class ExamView(APIView):
    def get(self,request, id):
        try:
            try:
                subjet = Subject.objects.get(subject_code = id)
            except Subject.DoesNotExist as e:
                return Response("subject not found", status=status.HTTP_404_NOT_FOUND)
            
            exam = Exam.objects.filter(course = subjet)
            serializer = ExamSerializer(exam, many = True)
            response_data = serializer.data
                # remove student
            for data in response_data:
                data.pop("student")
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            print("Exception:", e)
            return Response({"Response": str(e)}, status=status.HTTP_400_BAD_REQUEST)



    # create exam
    def post(self, request):
        try:
            exam_title = request.data.get('examTitle')
            exam_description = request.data.get('examDescription')
            exam_start_date = request.data.get('examStartDate')
            exam_end_date = request.data.get('examEndDate')
            exam_time = request.data.get('examTime')
            exam_max_score = request.data.get('examMaxScore')
            questions = request.data.get('questions', [])
            teacher = request.data.get('teacher')
            subject_code = request.data.get('subject_code')

            # # Get teacher and subject object
            try:
                teacher = get_object_or_404(Teacher,TeacherID=teacher)
                subject = get_object_or_404(Subject, subject_code=subject_code)

                # get all students enrolled in the subject
                students = SubjectEnroll.objects.filter(course=subject).values_list('student', flat=True)
                students = Student.objects.filter(studentID__in=students)

            except Teacher.DoesNotExist or Subject.DoesNotExist as e:
                print(e)
                return Response({"message":f"Teacher or Subject not found.{e}"}, status=status.HTTP_404_NOT_FOUND)
            

            # Create exam object
            try:
                exam = Exam.objects.create(
                    title=exam_title,
                    description=exam_description,
                    start_date=exam_start_date,
                    end_date=exam_end_date,
                    duration=exam_time,
                    max_grade=exam_max_score,
                    course=subject,
                    teacher=teacher

                )
                exam.save()


                # Add students to exam
                for student in students:
                    exam.student.add(student)
                    exam.save()
            except Exception as e:
                return Response({"message": f"Exam not created.{e}"}, status=status.HTTP_400_BAD_REQUEST)
            




            # create notification on exam creation
            try:
                notification = NotificationModel.objects.create(
                    title=f"New exam created: {exam.title}",
                    content=f"Exam created by {teacher.first_name} {teacher.last_name}",
                )
                notification.save()
            
                # get userObject from student
                for student in students:
                    user = get_object_or_404(User, username=student.studentID)
                    # add user to notification
                    notification.user.add(user)
                    notification.save()
            except Exception as e:
                print(e)
                
            

                # Accessing individual question data
            for question_data in questions:
                question_text = question_data.get('text')
                answer_type = question_data.get('answerType')

                # Create question object
                try:
                    question = Question.objects.create(
                        question=question_text
                    )
                except Exception as e:
                    print(e)
                    return Response({"message": f"Question not created.{e}"}, status=status.HTTP_400_BAD_REQUEST)

                # Create short answer question object
                if answer_type == 'short_answer':
                    try:
                        short_answer_question = ShortAnswerQuestion.objects.create(
                            exam=exam,
                            question_type=answer_type
                        )
                        short_answer_question.question.add(question)
                        short_answer_question.save()
                    except Exception as e:
                        print(e)
                        return Response({"message": f"Short answer question not created.{e}"}, status=status.HTTP_400_BAD_REQUEST)

                # Create long answer question object
                elif answer_type == 'long-answer':
                    try:
                        long_answer_question = LongAnswerQuestion.objects.create(
                            exam=exam,
                            question_type=answer_type
                        )
                        long_answer_question.question.add(question)
                        long_answer_question.save()
                    except Exception as e:
                        print(e)
                        return Response({"message": f"Long answer question not created.{e}"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"message": "Exam model created."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"Response":  e}, status=status.HTTP_400_BAD_REQUEST)
        


        
        

        

class ExamDetailView(APIView):
        # exam detail
        def get(self, request, exam_id):
            try:
                exam = Exam.objects.get(id=exam_id)
                exam_serializer = ExamSerializer(exam)
                response_data = exam_serializer.data

                # remove student field from response
                response_data.pop('student')

                # Get student data from exam
                students = exam.student.all()
                student_serializer = StudentSerializer(students, many=True)
                response_data['students'] = student_serializer.data

                # remove student field from student data
                for data in response_data['students']:
                    data.pop('image')
                    data.pop('phone')
                    data.pop('date_of_birth')
                    data.pop('country')
                    data.pop('state')
                    data.pop('city')
                    data.pop('zip_code')
                    data.pop('gender')
                    data.pop('email')




            

                # Get short answer question data from exam
                shortanswerquestion = ShortAnswerQuestion.objects.filter(exam=exam_id)
                shortanswerquestion_list = [
                    {
                        "id": question.id,
                        "question_type": question.question_type,
                        "last_modified": question.last_modified,
                        "additional_info": question.additional_info,
                        "question_number": question.question_number,
                        "exam": question.exam.id, 
                        "questions": 
                        [
                            {"id": q.id, "question": q.question}
                              for q in question.question.all()]}
                              for question in shortanswerquestion]
                response_data['short_answer_questions'] = shortanswerquestion_list




                longanswerquestion = LongAnswerQuestion.objects.filter(exam=exam_id)
                longanswerquestion_list = [
                    {
                        "id": question.id,
                        "question_type": question.question_type,
                        "last_modified": question.last_modified,
                        "additional_info": question.additional_info,
                        "question_number": question.question_number,
                        "exam": question.exam.id,
                        "questions": [
                            {"id": q.id, "question": q.question}
                            for q in question.question.all()
                        ]
                    }
                    for question in longanswerquestion
                ]
                response_data['long_answer_questions'] = longanswerquestion_list



                return Response(response_data, status=status.HTTP_200_OK)
            except Exam.DoesNotExist:
                return Response({"message": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                print(e)
                return Response({"Response": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            

   

        
        # update exam
        def put(self, request, exam_id):
            try:
                print(request.data)
                return Response("response_data", status=status.HTTP_200_OK)
            except:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
        # delete exam
        def delete(self, request, exam_id):
            try:
                exam = Exam.objects.get(id=exam_id)
                exam.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except:
           
           
                return Response(status=status.HTTP_400_BAD_REQUEST)
        




@api_view(['PUT'])
def updateExam(request, id):
    try:
        exam = Exam.objects.get(id=id)
        description = request.data.get('description')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        duration = request.data.get('duration')
        max_grade = request.data.get('max_grade')

        try:
            exam.description = description
            exam.start_date = start_date
            exam.end_date = end_date
            exam.duration = duration
            exam.max_grade = max_grade
            exam.save()
            return Response("Exam updated", status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_exam_list_by_student(request, student_id):
    try:
        # Get the student
        student = Student.objects.get(studentID=student_id)
        
        # Get the subjects that the student is enrolled in
        enrolled_subjects = SubjectEnroll.objects.filter(student=student).values_list('course', flat=True)
        
        # Get the exams for those subjects
        exams = Exam.objects.filter(course__in=enrolled_subjects, is_active=True)
        
        serializer = ExamSerializer(exams, many=True)
        response_data = serializer.data
        # remove unnecessary fields
        for data in response_data:
            data.pop('student')
            data.pop('teacher')
            data.pop('course')


        # get all questions for each exam
        # get all questions for each exam
        for data in response_data:
            short_answer_questions = ShortAnswerQuestion.objects.filter(exam=data['id'])
            shortanswerquestion_list = [
                {
                    "id": question.id,
                    "question_type": question.question_type,
                    "last_modified": question.last_modified,
                    "additional_info": question.additional_info,
                    "question_number": question.question_number,
                    "exam": question.exam.id, 
                    "questions": 
                    [
                        {"id": q.id, "question": q.question}
                        for q in question.question.all()
                    ]
                }
                for question in short_answer_questions
            ]
            data['short_answer_questions'] = shortanswerquestion_list


        
            long_answer_questions = LongAnswerQuestion.objects.filter(exam=data['id'])
            longanswerquestion_list = [
                {
                    "id": question.id,
                    "question_type": question.question_type,
                    "last_modified": question.last_modified,
                    "additional_info": question.additional_info,
                    "question_number": question.question_number,
                    "exam": question.exam.id,
                    "questions": [
                        {"id": q.id, "question": q.question}
                        for q in question.question.all()
                    ]
                }
                for question in long_answer_questions
            ]
            data['long_answer_questions'] = longanswerquestion_list


            

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response({"Response": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def save_exam_data(request):
    try:
        data = request.data
        exam_data = data.get('examData', [])
        student_id = data.get('studentId', '')

        # Get the student instance
        try:
            student = Student.objects.get(studentID=student_id)
        except Student.DoesNotExist:
            return Response({"message": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        # Extract the common exam_id outside the loop
        common_exam_id = exam_data[0].get('shortAnswer', [])[0].get('exam_id')
        try:
            exam = Exam.objects.get(pk=common_exam_id)
        except Exam.DoesNotExist:
            return Response({"message": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)
        
        for question_data in exam_data:
            short_answer_data = question_data.get('shortAnswer', [])
            long_answer_data = question_data.get('longAnswer', [])

            try:
                for sa_data in short_answer_data:
                    question_detail_id = sa_data.get('question_detail_id')
                    question_detail_id_instacne = Question.objects.get(pk=question_detail_id)
                    
                    question_id = sa_data.get('question_id')
                    short_question_instance = ShortAnswerQuestion.objects.get(pk=question_id)

                    try:
                        student_short_answer = ShortAnswerModel.objects.create(
                            student=student,
                            question=question_detail_id_instacne,
                            short_answer_question=short_question_instance,
                            answer=sa_data.get('studentAnswer')

                        )
                        student_short_answer.save()

                    except Exception as e:
                        print(e)
                        return Response({"message": f"Short answer question not created.{e}"}, status=status.HTTP_400_BAD_REQUEST)

            except ShortAnswerQuestion.DoesNotExist:
                return Response({"message": "Short Question or Question Model  model not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                for la_data in long_answer_data:
                    question_detail_id = la_data.get('question_detail_id')
                    question_detail_id_instacne = Question.objects.get(pk=question_detail_id)

                    question_id = la_data.get('question_id')
                    long_question_instance = LongAnswerQuestion.objects.get(pk=question_id)

                    try:
                        student_long_answer = LongAnswerModel.objects.create(
                            student=student,
                            question=question_detail_id_instacne,
                            long_answer_question=long_question_instance,
                            answer=la_data.get('studentAnswer')

                        )
                        student_long_answer.save()

                    except Exception as e:
                        print(e)
                        return Response({"message": f"Long answer question not created.{e}"}, status=status.HTTP_400_BAD_REQUEST)


            except LongAnswerQuestion.DoesNotExist:
                return Response({"message": "Long Exam model not found"}, status=status.HTTP_404_NOT_FOUND)


        return Response({"message": "Exam data saved."}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"Response": str(e)}, status=status.HTTP_400_BAD_REQUEST)

