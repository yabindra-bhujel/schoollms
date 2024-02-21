from courses.models import *
from courses.serializers import *
from .serializers import StudentSerializer,UserSerializer 
from .models import Student, Parent
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from courses.models import Department
User = get_user_model()
import csv

import io
import traceback


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def add_newStudent(request):
    try:
        # Extract department data
        department_name = request.data.get('department')
        department = Department.objects.get(Department_name=department_name)

        # Add the department to the student data
        student_data = request.data.copy()
        student_data['department'] = department.id

        # Create the student serializer
        student_serializer = StudentSerializer(data=student_data)
        if student_serializer.is_valid():
            student = student_serializer.save()

            # Create user data and serializer (your existing code)
            username = str(request.data['studentID'])
            date_of_birth = str(request.data['date_of_birth'])
            password = date_of_birth.replace("-", "")
            email = f"{username}{student.first_name}@gmail.com"

            user_data = {
                'username': username,
                'password': password,
                'email': email,
                'first_name': request.data['first_name'],
                'last_name': request.data['last_name'],
            }

            user_serializer = UserSerializer(data=user_data)
            if user_serializer.is_valid():
                user = user_serializer.save()
                user.is_student = True
                user.save()

                # Associate the user and email with the student
                student.user = user
                student.email = email
                student.save()

                return Response(student_serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(user_serializer.errors)
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            print(student_serializer.errors)
            return Response(student_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Department.DoesNotExist:
        return Response({"error": "Department not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def add_student_by_csv_file(request):
    try:
        uploaded_file = request.data.get('file')
        data_set = uploaded_file.read().decode('UTF-8')
        io_string = io.StringIO(data_set)
        next(io_string)  # Skip the header row

        for column in csv.reader(io_string, delimiter=',', quotechar='"'):
            # Check if the column list has at least 8 elements
            if len(column) < 8:
                continue

            # Extract department data
            department_name = column[7]

            try:
                department = Department.objects.get(Department_code=department_name)
            except Department.DoesNotExist:
                # Handle missing department case
                print(f"Department '{department_name}' not found. Skipping entry.")
                continue

            studentID = column[0]
            date_of_birth = column[5]
            password = date_of_birth.replace("-", "")
            email = f"{studentID}{column[1]}@gmail.com"
            first_name = column[1]
            last_name = column[2]
            middle_name = column[3]
            phone = column[4]
            gender = column[6]

            student = Student.objects.create(
                studentID=studentID,
                first_name=first_name,
                last_name=last_name,
                middle_name=middle_name,
                gender=gender,
                email=email,
                phone=phone,
                date_of_birth=date_of_birth,
                department=department,
            )
            user = User.objects.create_user(username=studentID, password=password,
                                            first_name=first_name, last_name=last_name, email=email, is_student=True)

            student.user = user
            student.save()

        return Response(status=status.HTTP_201_CREATED)
    except Exception as e:
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_student(request, studentID):
    try:
        student = Student.objects.get(studentID=studentID)
        student.delete()
        user = User.objects.get(username=studentID)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Student.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 



@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsAdminUser])
def student_list(request, username):
    try:
        students = Student.objects.all()

        student_data = []

        for student in students:
            data = {
                'studentID': student.studentID,
                'first_name': student.first_name,
                'last_name': student.last_name,
                'email': student.email,
                'phone': student.phone,
                'date_of_birth': student.date_of_birth,
                'department': student.department.Department_name,
                'image': request.build_absolute_uri(student.image.url),
                'user': student.user.username,
            }
            student_data.append(data)

        return Response(student_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def student_detail(request, studentID):

    try:
        student = Student.objects.get(studentID=studentID)
        serializer = StudentSerializer(student)
        course_enrolls = SubjectEnroll.objects.filter(student=student)
        # Create a list to store the course data
        course_data = []
        
        # Iterate over the course_enrolls queryset
        for enroll in course_enrolls:
            course = {
                'id': enroll.course.subject_code,
                'name': enroll.course.subject_name,
                'weekday':enroll.course.weekday,
                'start_time': enroll.course.period_start_time,
                'end_time': enroll.course.period_end_time,
                'class_room': enroll.course.class_room,
                'teacher': {
                    'id': enroll.teacher.id,
                    'name': enroll.teacher.first_name
                },
                'assignments': [],  # Initialize an empty list for assignments
            }


            # Get the assignments associated with the course
            assignments = Assignment.objects.filter(course=enroll.course)
            
            # Iterate over the assignments queryset
            for assignment in assignments:
                assignment_data = {
                    'id':assignment.id,
                    'assignment_title': assignment.assignment_title,
                    'assignment_description': assignment.assignment_description,
                    'assignment_deadline': assignment.assignment_deadline,
                    'assignment_posted_date': assignment.assignment_posted_date,
                    'assignment_type': assignment.assignment_type,
                    'assignment_start_date':assignment.assignment_start_date,
                    'is_active': assignment.is_active,

                }
                course['assignments'].append(assignment_data)
                # Add the assignment data to the course 
            course_data.append(course)

    
        # Create a dictionary with the student data
        student_data = {
            'studentID': serializer.data['studentID'],
            'first_name': serializer.data['first_name'],
            'last_name': serializer.data['last_name'],
            'gender': serializer.data['gender'],
            'date_of_birth': serializer.data['date_of_birth'],
            'email': serializer.data['email'],
            'phone': serializer.data['phone'],
            'address': serializer.data.get('address', ''),
            "department": DepartmentSerializers(student.department).data,
            'image': request.build_absolute_uri(serializer.data['image']),
            'user': serializer.data['user'],

            # address
            'country':serializer.data['country'],
            'state':serializer.data['state'],
            'city':serializer.data['city'],
            'zip_code':serializer.data['zip_code'],
            'parents': [],



        }
        # Get all of the parents that are assigned to this user and add them as a list under "parent" key
        parents = Parent.objects.filter(student=student)
        for parent in parents:
            if parent is None or parent == '':
                continue
            parent_data = {
                'father_name': parent.father_name,
                'mother_name': parent.mother_name,
                'parent_email': parent.parent_email,
                'parent_phone': parent.parent_phone,
            }
            student_data['parents'].append(parent_data)

        
        # Create a dictionary to combine the student data and course data
        serialized_data = {
            'student': student_data,
            'courses': course_data,
            # 'notification':notification_date
        }
        return Response(serialized_data)
    except Student.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    




from datetime import datetime

@api_view(["GET"])
def get_student_today_class(request, student_id):
    try:
        try:
            student = Student.objects.get(studentID=student_id)
        except Student.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # Get the current day of the week (Monday=0, Sunday=6)
        current_day_index = datetime.now().weekday()
        current_day = Subject.DAYS_OF_WEEK[current_day_index][0]

        # Filter classes for the current day
        subject_incharge = SubjectEnroll.objects.filter(student=student, course__weekday=current_day)
        
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
