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
from django.core.cache import cache


class NotificationViewSet(viewsets.ViewSet):
    serializer_class = NotificationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete_cache(self, request, check_key):
        cache.delete(check_key)

    @extend_schema(responses={200: NotificationSerializer})
    def list(self, request):
        cache_key = f"notifications_{request.user.id}"
        cached_notifications = cache.get(cache_key)

        if cached_notifications is None:
            queryset = Notification.objects.filter(user=request.user).order_by('-notification__timestamp')
            serializer = NotificationSerializer(queryset, many=True)
            cached_notifications = serializer.data
            cache.set(cache_key, cached_notifications, timeout=60 * 60)

        return Response(cached_notifications)
    
    @extend_schema(responses={200: NotificationSerializer})
    @action(detail=False, methods=['get'], url_path='notification_by_user', url_name='notification_by_user')
    def notification_by_user(self, request):
        cache_key = f"notifications_{request.user.id}"
        cached_notifications = cache.get(cache_key)

        if cached_notifications is None:
            queryset = Notification.objects.filter(user=request.user).order_by('-notification__timestamp')
            serializer = NotificationSerializer(queryset, many=True)
            cached_notifications = serializer.data
            cache.set(cache_key, cached_notifications, timeout=60 * 60)
        return Response(cached_notifications)

    @extend_schema(responses={200: NotificationSerializer})
    @action(detail=False, methods=['put'], url_path='read', url_name='read')
    def notification_read(self, request):
        user = get_object_or_404(User, username=request.user)
        notifications = UserNotification.objects.filter(user=user)
        for notification in notifications:
            notification.is_read = True
            notification.save()
            
        self.delete_cache(request, f"notifications_{request.user.id}")

        return Response(status=status.HTTP_200_OK)
