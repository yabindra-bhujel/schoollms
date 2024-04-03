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
from ..serializers import NotesSerializer
from django.db.models import Q
from ..models import Notes
from .services import *

class NotesViewSet(viewsets.ViewSet):
    serializer_class = NotesSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: NotesSerializer})
    def list(self, request):
        user = User.objects.get(username=request.user)
        queryset = Notes.objects.filter(Q(user=user) | Q(shared_with=user))
        queryset = queryset.distinct()
        serializer = NotesSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @extend_schema(responses={200: NotesSerializer})
    def retrieve(self, request, pk=None):
        queryset = Notes.objects.all()
        note = get_object_or_404(queryset, pk=pk)
        serializer = NotesSerializer(note)
        return Response(serializer.data)
    
    @extend_schema(responses={201: NotesSerializer})
    def create(self, request):
        user = request.user
        user_instance = User.objects.get(username=user)
        new_note = NotesService.new_note(user_instance, request.data)
        serializer = NotesSerializer(new_note)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

    @extend_schema(responses={200: NotesSerializer})
    def update(self, request, pk=None):
        queryset = Notes.objects.all()
        note = get_object_or_404(queryset, pk=pk)
        updated_note = NotesService.update_note(note, request.data)
        serializer = NotesSerializer(updated_note)
        return Response(serializer.data)
    
    @extend_schema(responses={204: None})
    def destroy(self, request, pk=None):
        queryset = Notes.objects.all()
        note = get_object_or_404(queryset, pk=pk)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @extend_schema(responses={200: NotesSerializer})
    @action(detail=False, methods=['put'], url_path='share_note/(?P<pk>\d+)', url_name='share_note')
    def share_note(self, request, pk=None):
        user = request.user
        admin = User.objects.get(username=user)
        note = NotesService.share_note_with_user(admin, pk, request.data)
        serializer = NotesSerializer(note)
        return Response(serializer.data)
    
