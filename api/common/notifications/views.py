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
from ..serializers import NotificationSerializer
from django.db.models import Q
from ..models import Notification, UserNotification

class NotificationViewSet(viewsets.ViewSet):
    serializer_class = NotificationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: NotificationSerializer})
    def list(self, request):
        user = get_object_or_404(User, username=request.user)
        queryset = Notification.objects.filter(user=user).order_by('-notification__timestamp')
        serializer = NotificationSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @extend_schema(responses={200: NotificationSerializer})
    @action(detail=False, methods=['get'], url_path='notification_by_user', url_name='notification_by_user')
    def notification_by_user(self, request):
        user_notifications = UserNotification.objects.filter(user=request.user).order_by('-notification__timestamp')
        serializer = NotificationSerializer(user_notifications, many=True)
        return Response(serializer.data)

    @extend_schema(responses={200: NotificationSerializer})
    @action(detail=False, methods=['put'], url_path='read', url_name='read')
    def notification_read(self, request):
        user = get_object_or_404(User, username=request.user)
        notifications = UserNotification.objects.filter(user=user)
        for notification in notifications:
            notification.is_read = True
            notification.save()
        return Response(status=status.HTTP_200_OK)
