from .models import Teacher
from .serializers import TeacherSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from courses.serializers import DepartmentSerializers
from django.contrib.auth import get_user_model
from courses.models import SubjectEnroll,Subject
import io
import csv
User = get_user_model()
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import datetime
from tenant.models import UserProfile,ApplicationSettings

@api_view(["DELETE"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
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
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def teacher_list(request):
    try:
        teacher = Teacher.objects.all()
        serializer = TeacherSerializer(teacher, many=True)
        for data in serializer.data:
            data["image"] = request.build_absolute_uri(data["image"])
        return Response(serializer.data)
    
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def add_teacher(request):
    try:
        data = request.data
        teacherID = data["teacherID"]
        date_of_birth = data["date_of_birth"]
        password = date_of_birth.replace("-", "")
        email = f"{teacherID}@gmail.com"
        first_name = data["first_name"]
        last_name = data["last_name"]
        gender = data["gender"]
        phone = data["phone"]
        address = data["address"]
        image = data["image"]
        try:
            teacher = Teacher.objects.create(
                TeacherID=teacherID,
                first_name=first_name,
                last_name=last_name,
                gender = gender,
                email = email,
                phone = phone,
                address = address,
                date_of_birth = date_of_birth,
                image = image,
            )
            user = User.objects.create_user(username=teacherID, password=password, 
                                            first_name=first_name, last_name=last_name, email=email, is_teacher=True)
            teacher.user = user
            teacher.save()

            userProfile = UserProfile.objects.create(user=user, image=image)
            userProfile.save()
            applicationSetting = ApplicationSettings.objects.create(user=user)
            applicationSetting.save()
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def add_teacher_by_file(request):
    try:
        uploaded_file = request.data.get('file')
        data_set = uploaded_file.read().decode('UTF-8')
        io_string = io.StringIO(data_set)
        next(io_string)

        for row_number, column in enumerate(csv.reader(io_string, delimiter=',', quotechar='"')):
            try:
                if len(column) >= 7:  
                    teacherID = column[0]
                    date_of_birth = column[1]
                    password = date_of_birth.replace("-", "")
                    email = f"{teacherID}@gmail.com"
                    first_name = column[2]
                    last_name = column[3]
                    gender = column[4]
                    phone = column[5]
                    address = column[6]

                    teacher = Teacher.objects.create(
                        TeacherID=teacherID,
                        first_name=first_name,
                        last_name=last_name,
                        gender=gender,
                        email=email,
                        phone=phone,
                        address=address,
                        date_of_birth=date_of_birth,
                    )
                    user = User.objects.create_user(username=teacherID, password=password, 
                                                    first_name=first_name, last_name=last_name, email=email, is_teacher=True)
                    teacher.user = user
                    teacher.save()
                    userProfile = UserProfile.objects.create(user=user)
                    userProfile.save()
                    applicationSetting = ApplicationSettings.objects.create(user=user)
                    applicationSetting.save()
            except Exception as e:
                return Response({"error": f"Error at row {row_number + 2}: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_201_CREATED)
    
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
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
        }

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

    return Response(serializer_data, status=status.HTTP_200_OK)

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_teacher_today_class(request):
    try:
        user = request.user
        if hasattr(user, 'is_teacher') and user.is_teacher:
            teacher = user.teacher
        else:
            return Response({"error": "User is not a teacher"}, status=status.HTTP_403_FORBIDDEN)
        
        current_day = datetime.now().strftime('%A')
        teacher_classes_today = Subject.objects.filter(subject_teacher=teacher, weekday=current_day)

        course_data = []
        for course in teacher_classes_today:
            course_data.append({
                "subject_code": course.subject_code,
                "subject_name": course.subject_name,
                "subject_description": course.subject_description,
                "weekday": course.weekday,
                "period_start_time": course.period_start_time,
                "period_end_time": course.period_end_time,
                "class_room": course.class_room,
                "class_period": course.class_period,
            })

        return Response(course_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)