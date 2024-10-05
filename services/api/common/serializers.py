from rest_framework import serializers
from .models import *
from .socials.models import *


class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = '__all__'

class NotesSerializer(serializers.ModelSerializer):

    owner = serializers.SerializerMethodField()

    class Meta:
        model = Notes
        fields = '__all__'

    def get_owner(self, obj)->str:
        return obj.user.username

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['title', 'timestamp', 'content']

class UserNotificationSerializer(serializers.ModelSerializer):
    notification = NotificationSerializer()

    class Meta:
        model = UserNotification
        fields = ['user', 'notification', 'is_read']

class GroupMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMessage
        fields = '__all__'


