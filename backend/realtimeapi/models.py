from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone


User = get_user_model()





class UserSocketID(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="user_socket_id"
    )
    socket_id = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.user.username} socket id: {self.socket_id}"


class Message(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_message"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="recive_message"
    )
    message = models.TextField()
    image_data = models.BinaryField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    is_delivered = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.username} to {self.receiver.username}: {self.message}"


class Group(models.Model):
    admin = models.ForeignKey(
        User, related_name="admin_group", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(User, related_name="member_group")
    timestamp = models.DateTimeField(auto_now_add=True)
    group_image = models.ImageField(upload_to="group_images", null=True, blank=True)

    def __str__(self):
        return self.name
    



class GroupMessage(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_group_message"
    )
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="group")
    message = models.TextField()
    image_data = models.BinaryField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} to {self.group.name}: {self.message}"


class FriendRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="receiver"
    )
    status = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("sender", "receiver")

    def __str__(self):
        return f"{self.sender.username} to {self.receiver.username}"


# news feed model

def format_time_since_created(created_at):
    now = timezone.now()
    time_difference = now - created_at

    if time_difference.days > 0:
        if time_difference.days == 1:
            return f"{time_difference.days} day ago"
        else:
            return f"{time_difference.days} days ago"
    elif time_difference.seconds >= 3600:
        hours = time_difference.seconds // 3600
        if hours == 1:
            return f"{hours} hour ago"
        else:
            return f"{hours} hours ago"
    elif time_difference.seconds >= 60:
        minutes = time_difference.seconds // 60
        if minutes == 1:
            return f"{minutes} minute ago"
        else:
            return f"{minutes} minutes ago"
    else:
        return "just now"


class Post(models.Model):
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    text = models.TextField(null=True, blank=True)
    images = models.ManyToManyField(
        "ImageStore", related_name="posts_with_images", blank=True
    )
    videos = models.ManyToManyField(
        "VideoStore", related_name="posts_with_videos", blank=True
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, related_name="liked_posts", blank=True)
    comments = models.ManyToManyField(
        "Comment", related_name="posts_with_comments", blank=True
    )

    def __str__(self):
        return f"Post by {self.user.username} at {self.created_at}"


    def time_since_created(self):
        return format_time_since_created(self.created_at)


class ImageStore(models.Model):
    image = models.ImageField(upload_to="posts/images")

    def __str__(self):
        return f"{self.image}"


class VideoStore(models.Model):
    video = models.FileField(upload_to="posts/videos")

    def __str__(self):
        return f"{self.video}"


class Comment(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comments_realtimeapi"
    )
    comment = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(
        User, related_name="liked_comments_realtimeapi", blank=True
    )
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="comments_realtimeapi"
    )

    def __str__(self):
        return f"Comment by {self.user.username}: {self.comment}"


class Like(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="likes_realtimeapi"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="likes_realtimeapi"
    )

    def __str__(self):
        return f"Like by {self.user.username}"
