from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
User = get_user_model()
from rest_framework import viewsets
from rest_framework.decorators import action
from django.db.models import Q
from .models import Message, Group, GroupMessage
from accounts.models import UserProfile
import json
from ..serializers import GroupMessageSerializer
from django.core.cache import cache
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.openapi import OpenApiTypes
from .serializers import *


@extend_schema(tags=["Private Messages"])
class PrivateMessagesViewSet(viewsets.ViewSet):
    serializer_class = MessageSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        action_permission_map = {
            'save_message': [],
        }

        if self.action in action_permission_map:
            permission_classes = []
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    @extend_schema(responses={200: dict})
    @action(detail=False, methods=['get'], url_path='user_list', url_name='list')
    def user_list(self, request):
        cache_key = f"users_{request.user.id}"
        user_data = cache.get(cache_key)

        if user_data is None:
            username = request.user.username

            users = User.objects.filter(~Q(username=username))

            profiles = UserProfile.objects.filter(user__in=users).select_related('user')

            user_data = [
                {
                    "is_teacher": profile.user.is_teacher,
                    "is_student": profile.user.is_student,
                    "username": profile.user.username,
                    "first_name": profile.user.first_name,
                    "last_name": profile.user.last_name,
                    "email": profile.user.email,
                    "image": request.build_absolute_uri(profile.image.url) if profile.image else None,
                }
                for profile in profiles
            ]

            user_data = [user for user in user_data if user["is_teacher"] or user["is_student"]]

            cache.set(cache_key, user_data, timeout=60 * 60)

        return Response({"users": user_data}, status=status.HTTP_200_OK)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="sender",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Sender username",
            ),
            OpenApiParameter(
                name="receiver",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Receiver username",
            )
        ],
        responses={200: MessageSerializer}
    )
    @action(detail=False, methods=['get'], url_path='message/(?P<sender>[^/.]+)/(?P<receiver>[^/.]+)', url_name='message_by_user')
    def message_by_sender_receiver(self, request, sender: str, receiver: str):
        sender = get_object_or_404(User, username=sender)
        receiver = get_object_or_404(User, username=receiver)
        messages = Message.objects.filter(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)).order_by('-timestamp')
        messages_data = []
        for message in messages:
            messages_data.append({
                "sender": message.sender.username,
                "receiver": message.receiver.username,
                "message": message.message,
                "timestamp": message.timestamp,
            })
        return Response({"messages":messages_data}, status=status.HTTP_200_OK)

    @extend_schema(responses={201: dict})
    @action(detail=False, methods=['post'], url_path='save_message', url_name='save_message')
    def save_message(self, requet):
        data = requet.data
        sender = data.get('sender')
        receiver = data.get('receiver')
        message = data.get('message')

        sender = get_object_or_404(User, username=sender)
        receiver = get_object_or_404(User, username=receiver)
        message = Message.objects.create(sender=sender, receiver=receiver, message=message)
        message.save()
        return Response({"message":"Message sent successfully"}, status=status.HTTP_201_CREATED)


@extend_schema(tags=["Group Messages"])
class GroupMessagesViewSet(viewsets.ViewSet):
    serializer_class = GroupMessageSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        action_permission_map = {
            'save_group_message': [],
        }

        if self.action in action_permission_map:
            permission_classes = []
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    @extend_schema(responses={201: dict})
    @action(detail=False, methods=['post'], url_path='create_group', url_name='create_group')
    def create_group(self, request):
        data = json.loads(request.body)
        group_name = data.get('group_name')
        users = data.get('users')

        # check group name is unique
        group = Group.objects.filter(name=group_name).first()
        if group:
            return Response({"message":"Group name already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # check if group name is empty or not
        if not group_name:
            return Response({"message":"Group name is required"}, status=status.HTTP_400_BAD_REQUEST)

        # check group name length
        if len(group_name) > 255:
            return Response({"message":"Group name is too long"}, status=status.HTTP_400_BAD_REQUEST)

        if len(group_name) < 3:
            return Response({"message":"Group name is too short"}, status=status.HTTP_400_BAD_REQUEST)

        if len(users) < 2:
            return Response({"message":"Group members should be more than 2"}, status=status.HTTP_400_BAD_REQUEST)

        admin_user = request.user.username
        admin_user = get_object_or_404(User, username=admin_user)

        user_objects = []
        for user in users:
            user = get_object_or_404(User, username=user)
            user_objects.append(user)

        group = Group.objects.create(name=group_name, admin=admin_user)
        group.save()
        group.members.add(*user_objects)
        group.save()
        return Response({"message":"Group created successfully"}, status=status.HTTP_201_CREATED)

    @extend_schema(responses={200: dict})
    @action(detail=False, methods=['get'], url_path='group_list', url_name='group_list')
    def group_list(self, request):
        cache_key = f"groups_{request.user.id}"
        group_data = cache.get(cache_key)

        if group_data is None:

            username = request.user.username
            requesting_user = User.objects.filter(username=username).first()
            groups = Group.objects.filter(
                Q(admin=requesting_user) | Q(members=requesting_user)
            ).distinct()

            group_data = []
            for group in groups:
                member_count = group.members.count()
                last_message = GroupMessage.objects.filter(group=group).order_by('-timestamp').first()
                last_message_data = None
                if last_message:
                    last_message_data = {
                        "message": last_message.message,
                        "sender": last_message.sender.username,
                        "timestamp": last_message.timestamp}

                group_data.append({
                    "id": group.id,
                    "name": group.name,
                    "admin": group.admin.username,
                    "member_count": member_count,
                    "members": [member.username for member in group.members.all()],
                    "type": "group",
                    "image": request.build_absolute_uri(group.group_image.url) if group.group_image else None,
                    "last_message": last_message_data})
                cache.set(cache_key, group_data, timeout=60 * 60)

        return Response({"groups":group_data}, status=status.HTTP_200_OK)

    @extend_schema(responses={201: dict})
    @action(detail=False, methods=['post'], url_path='save_group_message', url_name='save_group_message')
    def save_group_message(self, request):
        data = request.data
        group_id = data.get('group_id')
        group_name = data.get('group_name')
        message = data.get('message')
        sender_userId = data.get('sender')

        try:
            group = Group.objects.get(id=group_id, name=group_name)
            sender = User.objects.get(username=sender_userId)
        except Group.DoesNotExist:
            return Response({"message":"Group not found"}, status=status.HTTP_404_NOT_FOUND)

        group_message = GroupMessage.objects.create(sender=sender, group=group, message=message)
        group_message.save()
        return Response({"message":"Message sent successfully"}, status=status.HTTP_201_CREATED)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="group_id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the group",
            )
        ],
        responses={200: GroupMessageSerializer}
    )
    @action(detail=False, methods=['get'], url_path='group_message/(?P<group_id>[^/.]+)', url_name='group_message')
    def group_message_by_group(self, request, group_id: int):
        try:

            group = Group.objects.get(id=group_id)
            group_message = GroupMessage.objects.filter(group=group).order_by('timestamp')
            group_message_serializer = GroupMessageSerializer(group_message, many=True)

            for message in group_message_serializer.data:
                user = User.objects.get(id=message["sender"])
                sender_username = user.username
                group_name = group.name
                message["receiver_group"] = group_name
                message["sender_userId"] = sender_username
                message.pop('sender')
                message.pop('group')

            return Response({"messages":group_message_serializer.data}, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({"message":"Group not found"}, status=status.HTTP_404_NOT_FOUND)

    @extend_schema(responses={200: dict})
    @action(detail=False, methods=['put'], url_path='update_group_image', url_name='update_group_image')
    def update_group_image(self, request):
        try:
            group_id = request.data.get("group_id")
            group = Group.objects.get(id=group_id)
            group.group_image = request.FILES.get("group_image")
            group.save()
            return Response({"message":"Group image updated successfully"}, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({"message":"Group not found"}, status=status.HTTP_404_NOT_FOUND)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="group_id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the group",
            )
        ],
        responses={200: dict},
    )
    @action(
        detail=False,
        methods=["put"],
        url_path="leave_group/(?P<group_id>[^/.]+)",
        url_name="leave_group",
    )
    def leave_group(self, request, group_id: int = None):
        try:
            group = Group.objects.get(id=group_id)
            requesting_user = request.user
            group.members.remove(requesting_user)
            return Response({"message":"Left group successfully"}, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({"message":"Group not found"}, status=status.HTTP_404_NOT_FOUND)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="group_id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the group",
            )
        ],
        responses={204: None}
    )
    @action(detail=False, methods=['delete'], url_path='delete_group/(?P<group_id>[^/.]+)', url_name='delete_group')
    def delete_group(self, request, group_id: int):
        try:
            user = request.user
            group = Group.objects.get(id=group_id)
            if user != group.admin:
                return Response({"message":"You are not authorized to delete this group"}, status=status.HTTP_401_UNAUTHORIZED)

            group.delete()
            return Response({"message":"Group deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Group.DoesNotExist:
            return Response({"message":"Group not found"}, status=status.HTTP_404_NOT_FOUND)
