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
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.db.models import Q
import logging
logger = logging.getLogger(__name__)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_notification_by_user(request, username):
    try:
        user = get_object_or_404(User, username=username)
        user_notifications = UserNotification.objects.filter(user=user).order_by('-notification__timestamp')
        serializer = UserNotificationSerializer(user_notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_notification(request, username):
    try:
        user = get_object_or_404(User, username=username)
        user_notifications = UserNotification.objects.filter(user=user).order_by('-notification__timestamp')
        for user_notification in user_notifications:
            user_notification.is_read = True
            user_notification.save()
        serializer = UserNotificationSerializer(user_notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def deleteEvent(request, eventID):
    try:
        event = CalenderModel.objects.get(id=eventID)
        event.delete()
        return Response('Event deleted successfully', status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def updateEvent(request):
    try:
        start_date_data = request.data.get('start', None)
        event_id = request.data.get('id', None)
        if start_date_data is not None  and event_id is not None:
            event = CalenderModel.objects.get(id=event_id)
            start_date = datetime.fromisoformat(start_date_data[:-1]) 
            end_date = datetime.fromisoformat(start_date_data[:-1])
            event.start_date = timezone.make_aware(start_date)
            event.end_date = timezone.make_aware(end_date)
            event.save()
            return Response('Event updated successfully', status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid request data'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from .Service import get_calendar_events, make_class_cancellation

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def getCalenderEvent(request):
    try:
        username = request.user.username
        user = User.objects.get(username=username)
        
        calendar_events = get_calendar_events(user)
        if calendar_events is None:
            return Response({'error': 'No calendar events found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CalendarSerializers(calendar_events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def make_class_cancellation(request):
    try:
        event = request.data
        event_id = event['id']
        event = CalenderModel.objects.get(id=event_id)
        today = datetime.now().date()
        if event.start_date < today:
            return Response({'error': '講義日が過ぎているため 休講できません。'}, status=status.HTTP_400_BAD_REQUEST)
        
        if event.is_class_cancellation:
            event.is_class_cancellation = False
            event.save()
        else:
            event.is_class_cancellation = True
            event.save()
        return Response('Class cancellation updated successfully', status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def getEventBySubject(request):
    try:
        username = request.user.username
        user = User.objects.get(username=username)
        if user.is_student:
            student = Student.objects.get(user=user)
            enrolled_subjects = SubjectEnroll.objects.filter(student=student)
            subject_ids = enrolled_subjects.values_list('course__id', flat=True)
            calendar_events = CalenderModel.objects.filter(subject_id__in=subject_ids)
            serializer = CalendarSerializers(calendar_events, many=True)
            print(serializer.data)
            return Response(serializer.data)
        
        if user.is_teacher:
            teacher = Teacher.objects.get(user=user)
            calendar_events = CalenderModel.objects.filter(subject__subject_teacher=teacher)
            serializer = CalendarSerializers(calendar_events, many=True)
            print(serializer.data)
            return Response(serializer.data)
    except Exception as e:
        logger.error(e)
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def getTodayEvent(request):
    try:
        username = request.user.username
        user = User.objects.get(username=username)
        today = datetime.now().date()
        calendar_events = CalenderModel.objects.filter(user=user,start_date=today).exclude(Q(color='red') | Q(color='green'))
        serializer = CalendarSerializers(calendar_events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def get_dates_of_month(event_days, months=1):
    today = datetime.now()
    all_matching_dates = []
    for _ in range(months):
        first_day_of_month = today.replace(day=1)
        last_day_of_month = (first_day_of_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        all_dates = [first_day_of_month + timedelta(days=i) for i in range((last_day_of_month - first_day_of_month).days + 1)]
        matching_dates = [date.strftime('%Y-%m-%d') for date in all_dates if date.strftime('%A') in event_days]
        all_matching_dates.extend(matching_dates)
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
        start_time = newEvent['start_time']
        end_time = newEvent['end_time']

        event = CalenderModel.objects.create(user=user,title=title,start_date=start_date,end_date=end_date,color=color, start_time=start_time, end_time=end_time)
        event.save()
        return Response('Event added successfully', status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def updateNotesColor(request, noteid):
    try:
        color_data = request.data.get('color', None)
        if color_data is not None:
            notes = Notes.objects.get(id=noteid)
            notes.color = color_data
            notes.save()
            serializer = NotesSerializers(instance=notes)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid request data'}, status=status.HTTP_400_BAD_REQUEST)
    except Notes.DoesNotExist:
        return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def addNotes(request):
    try:
        data = request.data
        user_id = data["user"]
        user = User.objects.get(username=user_id)
        title = data["title"]
        content = data["content"]
        notes_count = Notes.objects.filter(user=user).count()
        if notes_count >= 6:
            return Response({'error': 'You can not add more than 15 notes'}, status=status.HTTP_403_FORBIDDEN)
        notes = Notes.objects.create(user=user, title=title, content=content)
        notes.save()
        serializer = NotesSerializers(notes, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def getNotes(request):
    try:
        userId = request.user.username
        user = User.objects.get(username=userId)
        notes = Notes.objects.filter(Q(user=user) | Q(shared_with=user))
        serializer = NotesSerializers(notes, many=True)
        notes = []
        existingIds = set()  
        for note in serializer.data:
            notesId = note['id']
            if notesId in existingIds:
                continue
            else:
                existingIds.add(notesId)
            notesTitle = note['title']
            noteContent = note['content']
            noteColor = note['color']
            noteType = note['note_type']
            
            noteOwner = User.objects.get(id=note['user'])
            noteOwnerUsername = noteOwner.username
            collaborators = []
            for collaborator_id in note['shared_with']:
                collaborator = User.objects.get(id=collaborator_id)
                profile = UserProfile.objects.filter(user=collaborator).first()
                collaborators.append({
                    'username': collaborator.username,
                    'image': request.build_absolute_uri(profile.image.url) if profile and profile.image else None,})
            notes.append({
                'id': notesId,
                'title': notesTitle,
                'content': noteContent,
                'color': noteColor,
                'note_type': noteType,
                'owner': noteOwnerUsername,
                'collaborators': collaborators
            })
        return Response(notes, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def deleteNotes(request, pk):
    try:
        notes = Notes.objects.get(id=pk)
        notes.delete()
        return Response('Notes deleted successfully', status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def getNotesByID(request, username, noteid):
    try:
        user = User.objects.get(username=username)
        notes = Notes.objects.get(user=user, id=noteid)
        serializer = NotesSerializers(notes, many=False)
        return Response(serializer.data)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def updateNotes(request, noteid):
    try:
        noteContent = request.data.get('content', None)
        noteTitle = request.data.get('title', None)
        if noteContent is not None:
            note = Notes.objects.get(id=noteid)
            note.title = noteTitle
            note.content = noteContent
            note.save()
            serializer = NotesSerializers(instance=note)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid request data'}, status=status.HTTP_400_BAD_REQUEST)
    except Notes.DoesNotExist:
        return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def updateNotesTitle(request, noteid):
    try:
        title_data = request.data.get('title', None)
        if title_data is not None:
            notes = Notes.objects.get(id=noteid)
            notes.title = title_data
            notes.save()
            serializer = NotesSerializers(instance=notes)
            return Response(serializer.data)
        else:
            return Response({'error': 'Invalid request data'}, status=status.HTTP_400_BAD_REQUEST)
    except Notes.DoesNotExist:
        return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def addCollaboratorToNote(request, noteid):
    try:
        username = request.user.username
        owner_user = User.objects.get(username=username)
        note = Notes.objects.get(user=owner_user, id=noteid)
        collaborator_usernames = request.data
        if note.note_type == 'private':
            note.note_type = 'shared'
        with transaction.atomic():
            for collaborator_username in collaborator_usernames:
                collaborator_user = User.objects.get(username=collaborator_username)
                note.shared_with.add(collaborator_user)
            note.save()
        return Response("Collaborators added successfully", status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
