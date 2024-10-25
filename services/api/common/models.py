from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class CalendarEvent(models.Model):
    title = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    color = models.CharField(max_length=20, null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    is_class_cancellation = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    subject = models.ForeignKey('subjects.Subject', on_delete=models.CASCADE, null=True, blank=True)
    reminder_time = models.DateTimeField(null=True, blank=True)
    is_reminder_sent = models.BooleanField(default=False)

    def __str__(self):
        return str(self.title)

class Notes(models.Model):
    class NoteType(models.TextChoices):
        PRIVATE = 'private', 'Private'
        SHARED = 'shared', 'Shared'

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='User')
    title = models.CharField(max_length=100, verbose_name='Title')
    content = models.TextField(verbose_name='Content')
    note_type = models.CharField(max_length=20, choices=NoteType.choices, default=NoteType.PRIVATE,
                                  verbose_name='Note Type')
    date = models.DateTimeField(auto_now_add=True, verbose_name='Date Created')
    color = models.CharField(max_length=20, null=True, blank=True, verbose_name='Color')
    shared_with = models.ManyToManyField(User, related_name='shared_notes', blank=True,
                                          verbose_name='Shared With')
    tag = models.CharField(max_length=100, default="University", null=True, blank=True, verbose_name='Tag')
    
    def __str__(self):
        return str(self.title)
    
    class Meta:
        verbose_name = "Note"
        verbose_name_plural = "Notes"

class Notification(models.Model):
    title = models.CharField(max_length=100, verbose_name='Title')
    content = models.TextField(verbose_name='Content')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Timestamp')
    user = models.ManyToManyField(User, verbose_name='User')
    
    def __str__(self):
        return str(self.title)
    
    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

class UserNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='User')
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, verbose_name='Notification')
    is_read = models.BooleanField(default=False, verbose_name='Is Read')
    
    def __str__(self):
        return f"{self.user.username} - {self.notification.title}"
    
    class Meta:
        verbose_name = "User Notification"
        verbose_name_plural = "User Notifications"