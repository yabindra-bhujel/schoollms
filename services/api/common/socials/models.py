from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    message = models.TextField(null=True, blank=True)
    image_data = models.BinaryField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username}: {self.message}"
    
    class Meta:
        ordering = ["-timestamp"]

class Group(models.Model):
    admin = models.ForeignKey(User, related_name="admin_of_groups", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(User, related_name="group_memberships")
    timestamp = models.DateTimeField(auto_now_add=True)
    group_image = models.ImageField(upload_to="group_images", null=True, blank=True)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ["-timestamp"]

class GroupMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_group_messages")
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="group_messages")
    message = models.TextField(null=True, blank=True)
    image_data = models.BinaryField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sender.username} to {self.group.name}: {self.message}"
    
    class Meta:
        ordering = ["-timestamp"]

def format_time_since_created(created_at):
    now = timezone.now()
    time_difference = now - created_at

    if time_difference.days > 0:
        return f"{time_difference.days} {'day' if time_difference.days == 1 else 'days'} ago"
    elif time_difference.seconds >= 3600:
        hours = time_difference.seconds // 3600
        return f"{hours} {'hour' if hours == 1 else 'hours'} ago"
    elif time_difference.seconds >= 60:
        minutes = time_difference.seconds // 60
        return f"{minutes} {'minute' if minutes == 1 else 'minutes'} ago"
    elif time_difference.seconds < 60:
        return f"{time_difference.seconds} {'second' if time_difference.seconds == 1 else 'seconds'} ago"
    else:
        return "just now"
