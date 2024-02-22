from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models.signals import m2m_changed
from django.contrib.auth import get_user_model
import requests
import json
from datetime import datetime

User = get_user_model()

class CalenderModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    time = models.TimeField(auto_now=False, auto_now_add=False, null=True, blank=True)
    color = models.CharField(max_length=20, null=True, blank=True)

    

    def __str__(self):
        return str(self.title)
    


class Notes(models.Model):
    NOTE_TYPE = (
        ('private', 'private'),
        ('shared', 'shared'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    note_type = models.CharField(max_length=20, choices=NOTE_TYPE, default='private')
    date = models.DateTimeField(auto_now_add=True)
    color = models.CharField(max_length=20, null=True, blank=True)
    shared_with = models.ManyToManyField(User, related_name='shared_with', blank=True)

    def __str__(self):
        return str(self.title)
    





class NotificationModel(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ManyToManyField(User)

    def __str__(self):
        return str(self.title)

class UserNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    notification = models.ForeignKey(NotificationModel, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.notification.title}"








from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from .models import NotificationModel, UserNotification
import requests
from datetime import datetime



@receiver(m2m_changed, sender=NotificationModel.user.through)
def notify_users(sender, instance, action, pk_set, **kwargs):
    if action == "post_add":
        endpoint = 'http://127.0.0.1:3001/notification'
        user_notifications_data = []

        for user_id in pk_set:
            user = User.objects.get(id=user_id)

            # Create UserNotification instance
            user_notification = UserNotification.objects.create(
                user=user,
                notification=instance,
                is_read=False
            )

            user_notifications_data.append({
                'username': user.username,
                'notification_id': instance.id,
                'is_read': user_notification.is_read
            })
            print(f"Preparing notification for {user.username}")

        data = {
            'id': instance.id,
            'users_notifications': user_notifications_data,
            'title': instance.title,
            'content': instance.content,
            'timestamp': datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        }

        try:
            response = requests.post(endpoint, json=data)
            print(f"Notification sent to Flask server: {response.status_code}, {response.reason}")
        except Exception as e:
            print(f"Error in sending data: {e}")











