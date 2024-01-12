from student.models import Student, Parent
from .models import Teacher
from .serializers import TeacherSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from courses.serializers import SubjectSerializer,SubjectEnrollSerializers,DepartmentSerializers
from django.contrib.auth import get_user_model
from courses.models import SubjectEnroll,Subject

User = get_user_model()



@api_view(["DELETE"])
def delete_teacher(request, TeacherID):
    try:
        teacher = Teacher.objects.get(TeacherID=TeacherID)
        teacher.delete()
        user = User.objects.get(username=TeacherID)
        user.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Teacher.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(["GET", "POST"])
def teacher_list(request, username):
    if request.method == "GET":
        teachers = Teacher.objects.all()
        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = TeacherSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)



@api_view(["GET"])
def teacher_detail(request, TeacherID):
    try:
        teacher = Teacher.objects.get(TeacherID=TeacherID)
    except Teacher.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = TeacherSerializer(teacher)

    subject_incharge = SubjectEnroll.objects.filter(teacher=teacher)

    teacher_data = {
        "id": serializer.data["id"],
        "teacherID": serializer.data["TeacherID"],
        "first_name": serializer.data["first_name"],
        "last_name": serializer.data["last_name"],
        "email": serializer.data["email"],
        "gender": serializer.data["gender"],
        "phone": serializer.data["phone"],
        "address": serializer.data["address"],
        "image": request.build_absolute_uri(serializer.data["image"]),
        "date_of_birth": serializer.data["date_of_birth"],
        "user": serializer.data["user"],
    }

    subjects_data = []
    for enroll in subject_incharge:
        subject_data = {
            "subject_code": enroll.course.subject_code,
            "subject_name": enroll.course.subject_name,
            "subject_description": enroll.course.subject_description,
            "weekday":enroll.course.weekday,
            "period_start_time":enroll.course.period_start_time,
            "period_end_time":enroll.course.period_end_time,
            "class_room":enroll.course.class_room,
            "class_period":enroll.course.class_period,


            # Add other subject details if needed
        }

        # Get information about the students enrolled in the subject
        students_data = []
        for student in enroll.student.all():
            student_data = {
                "studentID": student.studentID,
                "first_name": student.first_name,
                "middle_name": student.middle_name,
                "last_name": student.last_name,
                "email": student.email,
                "gender": student.gender,
                "phone": student.phone,
                "department": DepartmentSerializers(student.department).data,
                "image": request.build_absolute_uri(student.get_imageUrl),
                "date_of_birth": student.date_of_birth,
                "country": student.country,
                "state": student.state,
                "city": student.city,
                "zip_code": student.zip_code,
            }
            students_data.append(student_data)

        subject_data["students"] = students_data
        subjects_data.append(subject_data)

    serializer_data = {
        "teacher": teacher_data,
        "subjects": subjects_data,
    }

    return Response(serializer_data)


@api_view(["POST"])
def add_teacher(request):
    serializer = TeacherSerializer(data=request.data)

    print(serializer)
    if serializer.is_valid():
        teacher = serializer.save()
        username = request.data["TeacherID"]
        date_of_birth = str(request.data["date_of_birth"])
        password = date_of_birth.replace("-", "")
        print(password)
        email = f"{username}{teacher.first_name}@gmail.com"

        try:
            user = User.objects.create_user(username=username, password=password)
            user.is_teacher = True
            user.email = email
            user.first_name = request.data["first_name"]
            user.last_name = request.data["last_name"]
            user.save()  # Save the user object
            teacher.user = user
            teacher.email = email
            teacher.save()  # Save the teacher object
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from datetime import datetime

@api_view(["GET"])
def get_teacher_today_class(request, teacher_id):
    try:
        try:
            teacher = Teacher.objects.get(TeacherID=teacher_id)
        except Teacher.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # Get the current day of the week (Monday=0, Sunday=6)
        current_day_index = datetime.now().weekday()
        current_day = Subject.DAYS_OF_WEEK[current_day_index][0]

        # Filter classes for the current day
        subject_incharge = SubjectEnroll.objects.filter(teacher=teacher, course__weekday=current_day)
        
        subjects_data = []
        for enroll in subject_incharge:
            subject_data = {
                "subject_code": enroll.course.subject_code,
                "subject_name": enroll.course.subject_name,
                "subject_description": enroll.course.subject_description,
                "weekday": enroll.course.weekday,
                "period_start_time": enroll.course.period_start_time,
                "period_end_time": enroll.course.period_end_time,
                "class_room": enroll.course.class_room,
                "class_period": enroll.course.class_period,
            }
            subjects_data.append(subject_data)
        
        return Response(subjects_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
