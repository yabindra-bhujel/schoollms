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
from django.db.models import Q
from .models import Message, Group, GroupMessage
from accounts.models import UserProfile
import json
from ..serializers import GroupMessageSerializer

class PrivateMessagesViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: Message})
    @action(detail=False, methods=['get'], url_path='user_list', url_name='list')
    def user_list(self, request):
        username = request.user.username
        users = User.objects.all()
        requesting_user = User.objects.filter(username=username).first()

        if requesting_user:
            users = users.exclude(id=requesting_user.id)
        
        user_data = []
        for user in users:
            profile = UserProfile.objects.filter(user=user).first()
            user_data.append({
                "is_teacher": user.is_teacher,
                "is_student": user.is_student,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "image": request.build_absolute_uri(profile.image.url)if profile and profile.image else None,
            })
            user_data = [user for user in user_data if user["is_teacher"] or user["is_student"]]

        return Response({"users":user_data}, status=status.HTTP_200_OK)
        

    @extend_schema(responses={200: Message})
    @action(detail=False, methods=['get'], url_path='message/(?P<sender>[^/.]+)/(?P<receiver>[^/.]+)', url_name='message_by_user')
    def message_by_sender_receiver(self, request, sender, receiver):
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
    
    @extend_schema(responses={201: Message})
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


class GroupMessagesViewSet(viewsets.ViewSet):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={201, Group})
    @action(detail=False, methods=['post'], url_path='create_group', url_name='create_group')
    def create_group(self, request):
        data = json.loads(request.body)
        group_name = data.get('group_name')
        users = data.get('users')
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
        
    @extend_schema(responses={200: Group})
    @action(detail=False, methods=['get'], url_path='group_list', url_name='group_list')
    def group_list(self, request):
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
        return Response({"groups":group_data}, status=status.HTTP_200_OK)
    

    @extend_schema(responses={201: GroupMessage})
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

    @extend_schema(responses={200: GroupMessage})
    @action(detail=False, methods=['get'], url_path='group_message/(?P<group_id>[^/.]+)', url_name='group_message')
    def group_message_by_group(self, request, group_id):
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
        
    @extend_schema(responses={200: Group})
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
        
    @extend_schema(responses={200: Group})
    @action(detail=False, methods=['put'], url_path='leave_group/(?P<group_id>[^/.]+)', url_name='leave_group')
    def leave_group(self, request, group_id:None):
        try:
            group = Group.objects.get(id=group_id)
            requesting_user = request.user
            group.members.remove(requesting_user)
            return Response({"message":"You have left the group"}, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({"message":"Group not found"}, status=status.HTTP_404_NOT_FOUND)
        
    
    @extend_schema(responses={204: Group})
    @action(detail=False, methods=['delete'], url_path='delete_group/(?P<group_id>[^/.]+)', url_name='delete_group')
    def delete_group(self, request, group_id):
        try:
            user = request.user
            group = Group.objects.get(id=group_id)
            if user != group.admin:
                return Response({"message":"You are not authorized to delete this group"}, status=status.HTTP_401_UNAUTHORIZED)

            group.delete()
            return Response({"message":"Group deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Group.DoesNotExist:
            return Response({"message":"Group not found"}, status=status.HTTP_404_NOT_FOUND)