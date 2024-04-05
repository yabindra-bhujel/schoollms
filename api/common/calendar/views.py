from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
User = get_user_model()
from rest_framework import viewsets
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from ..models import CalendarEvent
from ..serializers import CalendarEventSerializer
from .service import *
from django.db.models import Q


class CalendarEventViewSet(viewsets.ViewSet):
    serializer_class = CalendarEventSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: CalendarEventSerializer})
    def list(self, request):
        new_event = CalendarService.get_calendar_events(request.user)
        serializer = CalendarEventSerializer(new_event, many=True)
        return Response(serializer.data)
    
    @extend_schema(responses={200: CalendarEventSerializer})
    def retrieve(self, request, pk=None):
        queryset = CalendarEvent.objects.all()
        event = get_object_or_404(queryset, pk=pk)
        serializer = CalendarEventSerializer(event)
        return Response(serializer.data)
    
    @extend_schema(responses={201: CalendarEventSerializer})
    def create(self, request):
        user = User.objects.get(username=request.user)
        new_event = CalendarService.create_event(user, request.data)
        serializer = CalendarEventSerializer(new_event)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @extend_schema(responses={200: CalendarEventSerializer})
    def update(self, request, pk=None):
        queryset = CalendarEvent.objects.all()
        event = get_object_or_404(queryset, pk=pk)
        serializer = CalendarEventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(responses={200: CalendarEventSerializer})
    @action(detail=False, methods=['put'], url_path='update_event_date', url_name='update_event_date')
    def update_event_date(self, request, pk=None):
        event = CalendarService.update_event_date(request.data)
        serializer = CalendarEventSerializer(event)
        return Response(serializer.data)
    
    
    @extend_schema(responses={200: CalendarEventSerializer})
    @action(detail=False, methods=['put'], url_path='make_class_cancellation', url_name='make_class_cancellation')
    def make_class_cancellation(self, request, pk=None):
        try:
            event = request.data
            event_id = event['id']
            event = CalendarEvent.objects.get(id=event_id)
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
            return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

       
    
    @extend_schema(responses={204: None})
    def destroy(self, request, pk=None):
        queryset = CalendarEvent.objects.all()
        event = get_object_or_404(queryset, pk=pk)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @extend_schema(responses={200: CalendarEventSerializer})
    @action(detail=False, methods=['get'], url_path='get_todat_event', url_name='get_todat_event')
    def get_today_event(self, request):
        today = datetime.now().date()
        calendar_events = CalendarEvent.objects.filter(user=request.user,start_date=today).exclude(Q(color='red') | Q(color='green'))
        serializer = CalendarEventSerializer(calendar_events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        