from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import viewsets
from rest_framework.decorators import action
from ..serializers import NotesSerializer
from django.db.models import Q
from ..models import Notes
from .services import *
from django.core.cache import cache
import time
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.openapi import OpenApiTypes
import logging

logger = logging.getLogger(__name__) # common.notes.views
User = get_user_model()


@extend_schema(tags=["Notes"])
class NotesViewSet(viewsets.ViewSet):
    serializer_class = NotesSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def delete_cache(self, request, check_key):
        cache.delete(check_key)

    @extend_schema(responses={200: NotesSerializer})
    def list(self, request):
        cache_key = f"notes_{request.user.id}"
        cached_notes = cache.get(cache_key)

        if cached_notes is None:
            queryset = Notes.objects.filter(Q(user=request.user) | Q(shared_with=request.user))
            queryset = queryset.distinct().prefetch_related('user')
            serializer = NotesSerializer(queryset, many=True)
            cached_notes = serializer.data
            cache.set(cache_key, cached_notes, timeout=60 * 60)

        return Response(cached_notes)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the note",
            )
        ],
        responses={200: NotesSerializer},
    )
    def retrieve(self, request, id:int=None):
        queryset = Notes.objects.all()
        note = get_object_or_404(queryset, id=id)
        serializer = NotesSerializer(note)
        return Response(serializer.data)

    @extend_schema(responses={201: NotesSerializer})
    def create(self, request):
        user = request.user
        user_instance = User.objects.get(username=user)
        new_note = NotesService.new_note(user_instance, request.data)
        serializer = NotesSerializer(new_note)

        self.delete_cache(request, f"notes_{request.user.id}")

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the note",
            )
        ],
        responses={200: NotesSerializer},
    )
    def update(self, request, id:str=None):
        queryset = Notes.objects.all()
        note = get_object_or_404(queryset, id=id)
        updated_note = NotesService.update_note(note, request.data)
        serializer = NotesSerializer(updated_note)

        self.delete_cache(request, f"notes_{request.user.id}")

        return Response(serializer.data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the note",
            )
        ],
        responses={204: None},
    )
    def destroy(self, request, id: int=None):
        queryset = Notes.objects.all()
        note = get_object_or_404(queryset, id=id)
        note.delete()

        self.delete_cache(request, f"notes_{request.user.id}")

        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the note",
            )
        ],
        responses={200: NotesSerializer},
    )
    @action(
        detail=False,
        methods=["put"],
        url_path="share_note/(?P<id>\d+)",
        url_name="share_note",
    )
    def share_note(self, request, id: int=None):
        user = request.user
        admin = User.objects.get(username=user)
        note = Notes.objects.get(user=admin, id=id)
        data = request.data

        newNote = NotesService.share_note_with_user(admin, note, data)
        serializer = NotesSerializer(newNote)

        self.delete_cache(request, f"notes_{request.user.id}")

        return Response(serializer.data)
    
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the note",
            )
        ],
        responses={200: dict},
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="collaborator_list/(?P<id>\d+)",
        url_name="collaborator_list",
    )
    def collaborator_list(self, request: Request, id: int):
        note = Notes.objects.get(id=id)
        collaborators = NotesService.get_collaborators(note, request)

        return Response(collaborators)
    
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the note",
            )
        ],
        responses={200: dict},
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="shareable_user_list/(?P<id>\d+)",
        url_name="shareable_user_list",
    )

    def shareable_user_list(self, request: Request, id: int):
        note = Notes.objects.get(id=id)
        shareable_users = NotesService.get_shareable_users(note, request)

        return Response(shareable_users)
    

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the note",
            )
        ],
        responses={204: dict},
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="remove_collaborator/(?P<id>\d+)",
        url_name="remove_collaborator",
    )
    def remove_collaborator(self, request: Request, id: int):
        note = Notes.objects.get(id=id)
        collaboratorList = request.data

        for username in collaboratorList:
            collaborator = User.objects.get(username=username)
            note.shared_with.remove(collaborator)
            note.save()
        
        if note.shared_with.count() == 0:
            note.note_type = 'private'
            note.save()

        self.delete_cache(request, f"notes_{request.user.id}")

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the note",
            )
        ],
        responses={200: dict},
    )
    @action(
        detail=False,
        methods=["put"],
        url_path="change_note_mode/(?P<id>\d+)",
        url_name="change_note_mode",
    )
    def change_note_mode(self, request: Request, id: int):
        try:
            note = Notes.objects.get(id=id)
        except ObjectDoesNotExist:
            return Response({"detail": "Note not found."}, status=status.HTTP_404_NOT_FOUND)

        if note.note_type == 'private':
            note.note_type = 'shared'
            note.save()
            
            self.delete_cache(request, f"notes_{request.user.id}")

            return Response({"detail": "Note shared successfully."}, status=status.HTTP_200_OK)

        elif note.note_type == 'shared':
            note.note_type = 'private'
            note.shared_with.clear()
            note.save()

            self.delete_cache(request, f"notes_{request.user.id}")
            
            return Response({"detail": "Note set to private."}, status=status.HTTP_200_OK)

        self.delete_cache(request, f"notes_{request.user.id}")

        return Response(status=status.HTTP_200_OK)
