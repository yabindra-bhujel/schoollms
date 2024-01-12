from rest_framework.serializers import ModelSerializer
from .models import *

class CalendarSerializers(ModelSerializer):
    class Meta:
        model = CalenderModel
        fields = '__all__'



class NotesSerializers(ModelSerializer):
    class Meta:
        model = Notes
        fields = '__all__'


        


class NotificationModelSerializer(ModelSerializer):
    class Meta:
        model = NotificationModel
        fields = ['title', 'timestamp', 'content']


        

class UserNotificationSerializer(ModelSerializer):
    notification = NotificationModelSerializer()

    class Meta:
        model = UserNotification
        fields = ['user', 'notification', 'is_read']
