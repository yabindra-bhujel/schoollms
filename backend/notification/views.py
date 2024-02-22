from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.response import Response
from rest_framework import status
from student.models import Student
from tenant.models import UserProfile
from.models import *
from.serializers import *
from courses.models import Subject,SubjectEnroll
from django.contrib.auth import get_user_model
User = get_user_model()
from datetime import datetime, timedelta
from teacher.models import Teacher
from django.utils import timezone
from django.db.models import Q
from django.db import transaction
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes





@api_view(['GET'])
def get_notification_by_user(request, username):
    try:
        user = get_object_or_404(User, username=username)

        user_notifications = UserNotification.objects.filter(user=user).order_by('-notification__timestamp')
        serializer = UserNotificationSerializer(user_notifications, many=True)

        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['PUT'])
def update_notification(request, username):
    try:
        user = get_object_or_404(User, username=username)
        
        # Get UserNotification objects for the user
        user_notifications = UserNotification.objects.filter(user=user).order_by('-notification__timestamp')

        # Update is_read to True for each notification
        for user_notification in user_notifications:
            user_notification.is_read = True
            user_notification.save()

        # Serialize the notifications
        serializer = UserNotificationSerializer(user_notifications, many=True)

        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['DELETE'])
def delete_event(request, eventID):
    try:
        event = CalenderModel.objects.get(id=eventID)
        event.delete()
        return Response('Event deleted successfully', status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['PUT'])
def update_event_date(request):
    try:
        start_date_data = request.data.get('start', None)
        event_id = request.data.get('id', None)
        
        if start_date_data is not None  and event_id is not None:
            event = CalenderModel.objects.get(id=event_id)

            # Parse the incoming date strings to datetime objects
            start_date = datetime.fromisoformat(start_date_data[:-1]) 
            end_date = datetime.fromisoformat(start_date_data[:-1])

            # Assign the parsed datetime objects to your model
            event.start_date = timezone.make_aware(start_date)
            event.end_date = timezone.make_aware(end_date)

            event.save()
            return Response('Event updated successfully', status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid request data'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def getCalenderEvent(request):
    try:
        username = request.user.username
        calender = CalenderModel.objects.filter(user__username=username)
        serializer = CalendarSerializers(calender, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
def getTodayEvent(request, username):
    try:
        user = User.objects.get(username=username)
        today = datetime.now().date()
        
        # calendar_events = CalenderModel.objects.filter(user=user, start_date=today).exclude(color='red', color='green')
        from django.db.models import Q

        calendar_events = CalenderModel.objects.filter(
            user=user,
            start_date=today
        ).exclude(
            Q(color='red') | Q(color='green')
        )

        serializer = CalendarSerializers(calendar_events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def get_dates_of_month(event_days, months=1):
    # Get the current date
    today = datetime.now()

    all_matching_dates = []

    # Generate dates for each month
    for _ in range(months):
        # Calculate the first day of the current month
        first_day_of_month = today.replace(day=1)

        # Calculate the last day of the current month
        last_day_of_month = (first_day_of_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)

        # Generate a list of dates for the entire month
        all_dates = [first_day_of_month + timedelta(days=i) for i in range((last_day_of_month - first_day_of_month).days + 1)]

        # Collect dates that correspond to the specified event days
        matching_dates = [date.strftime('%Y-%m-%d') for date in all_dates if date.strftime('%A') in event_days]

        all_matching_dates.extend(matching_dates)

        # Move to the next month
        today = today.replace(day=1) + timedelta(days=32)

    return all_matching_dates
    



@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def addCalenderEvent(request):
    user = request.user
    try:
        newEvent = request.data
        title = newEvent['title']
        start_date = newEvent['start_date']
        end_date = newEvent['end_date']
        color = newEvent['color']


        event = CalenderModel.objects.create(
            user=user,
            title=title,
            start_date=start_date,
            end_date=end_date,
            color=color,
        )
        event.save()


     
        return Response('Event added successfully', status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # add new event
# @api_view(['POST'])
# def addCalender_event(request, ):
#     try:
#         months_to_generate = 6

#         user_id = request.data["user"]

#         username = request.data["username"]
#         # user object from userid
#         user = User.objects.get(id=user_id)

#         is_teacher = user.is_teacher
#         is_student = user.is_student
#         if is_teacher:
#             # get teacher from username
#             teacher = Teacher.objects.get(TeacherID=username)
            
            
#             subject = Subject.objects.filter(subject_teacher=teacher)
#             for i in subject:
#                 subject_name = i.subject_name
#                 subject_time = i.period_start_time

#                 event_week_days = i.weekday.split(',')  # Assuming weekdays are stored as comma-separated values
#                 dates = get_dates_of_month(event_week_days,months_to_generate)
                
#                 for date in dates:
#                     # check event is already exist or not
#                     event = CalenderModel.objects.filter(user=user, title=subject_name, start_date=date).first()
#                     if not event:
#                         event = CalenderModel.objects.create(
#                             user=user,
#                             title=subject_name,
#                             start_date=date,
#                             end_date=date,
#                             time=subject_time,
#                             color='red'
#                         )
#                         event.save()

#         elif is_student:
#             # get student from username
#             student = Student.objects.get(studentID=username)
#             course = SubjectEnroll.objects.filter(student=student)
#             for i in course:
#                 subject_name = i.course.subject_name
#                 subject_start_time = i.course.period_start_time
                

#                 event_week_days = i.course.weekday.split(',')
#                 dates = get_dates_of_month(event_week_days, months_to_generate)

#                 for date in dates:
#                     # check event is already exist or not
#                     event = CalenderModel.objects.filter(user=user, title=subject_name, start_date=date).first()
#                     if not event:
#                         event = CalenderModel.objects.create(
#                             user=user,
#                             title=subject_name,
#                             start_date=date,
#                             end_date=date,
#                             time=subject_start_time,
#                             color='green'
#                         )
#                         event.save()


#         serializer = CalendarSerializers(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     except Exception as e:
#         print(e)
#         return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# notes
@api_view(['PUT'])
def updateNotesColor(request, noteid):
    try:
        color_data = request.data.get('color', None)
        if color_data is not None:
            # Get the existing Notes object
            notes = Notes.objects.get(id=noteid)
            notes.color = color_data
            notes.save()
            serializer = NotesSerializers(instance=notes)
            return Response(serializer.data)
        else:
            return Response({'error': 'Invalid request data'}, status=status.HTTP_400_BAD_REQUEST)
    except Notes.DoesNotExist:
        return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def addNotes(request):
    try:

        data = request.data
        user_id = data["user"]
        user = User.objects.get(username=user_id)
        title = data["title"]
        content = data["content"]


        # check how much notes are already exist for this user
        notes_count = Notes.objects.filter(user=user).count()
        if notes_count >= 6:
            return Response({'error': 'You can not add more than 15 notes'}, status=status.HTTP_403_FORBIDDEN)

        
        notes = Notes.objects.create(user=user, title=title, content=content)
        notes.save()
        serializer = NotesSerializers(notes, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    



@api_view(['GET'])
def getNotes(request, user_id):
    try:
        user = User.objects.get(username=user_id)
        # Get notes where the user is the owner and notes where the user is a collaborator
        notes = Notes.objects.filter(Q(user=user) | Q(shared_with=user))
        serializer = NotesSerializers(notes, many=True)
        note_data = []
        for note in serializer.data:
            note_id = note['id']
            note_title = note['title']
            note_content = note['content']
            note_color = note['color']
            note_type = note['note_type']

            # Get the owner of the note
            note_owner = User.objects.get(id=note['user'])
            note_owner_username = note_owner.username

            # Get the collaborators of the note
            collaborators = []
            for collaborator_id in note['shared_with']:
                collaborator = User.objects.get(id=collaborator_id)
                collaborators.append(collaborator.username)

            note_data.append({
                'id': note_id,
                'title': note_title,
                'content': note_content,
                'color': note_color,
                'note_type': note_type,
                'owner': note_owner_username,
                'collaborators': collaborators
            })


        
        return Response(note_data)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['DELETE'])
def deleteNotes(request, pk):
    try:
        notes = Notes.objects.get(id=pk)
        notes.delete()
        return Response('Notes deleted successfully')
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['GET'])
def getNotesByID(request, username, noteid):
    try:
        user = User.objects.get(username=username)
        notes = Notes.objects.get(user=user, id=noteid)
        serializer = NotesSerializers(notes, many=False)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    




@api_view(['PUT'])
def updateNotes(request, noteid):
    try:
        # Retrieve only the 'content' field from the request data
        content_data = request.data.get('content', None)
        
        if content_data is not None:
            # Get the existing Notes object
            notes = Notes.objects.get(id=noteid)

            # Update the 'content' field
            notes.content = content_data
            notes.save()

            # Serialize the updated Notes object
            serializer = NotesSerializers(instance=notes)
            return Response(serializer.data)
        else:
            return Response({'error': 'Invalid request data'}, status=status.HTTP_400_BAD_REQUEST)
    except Notes.DoesNotExist:
        return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['PUT'])
def updateNotesTitle(request, noteid):
    try:
        print(request.data)
        # Retrieve only the 'content' field from the request data
        title_data = request.data.get('title', None)
        
        if title_data is not None:
            # Get the existing Notes object
            notes = Notes.objects.get(id=noteid)

            # Update the 'content' field
            notes.title = title_data
            notes.save()

            # Serialize the updated Notes object
            serializer = NotesSerializers(instance=notes)
            return Response(serializer.data)
        else:
            return Response({'error': 'Invalid request data'}, status=status.HTTP_400_BAD_REQUEST)
    except Notes.DoesNotExist:
        return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['POST'])
def add_collaborator_to_note(request, username, noteid):
    try:
        # Get the user who is the owner of the note
        owner_user = User.objects.get(username=username)
        # Get the note
        note = Notes.objects.get(user=owner_user, id=noteid)

        # Get the list of usernames from the request data
        collaborator_usernames = request.data

        # If the note type is private, change it to shared
        if note.note_type == 'private':
            note.note_type = 'shared'

        # Use a transaction to ensure atomicity
        with transaction.atomic():
            # Iterate over each username and add them as collaborators
            for collaborator_username in collaborator_usernames:
                collaborator_user = User.objects.get(username=collaborator_username)
                note.shared_with.add(collaborator_user)

            # Save the changes
            note.save()

        return Response("Collaborators added successfully", status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
