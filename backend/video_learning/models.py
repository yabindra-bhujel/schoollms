from django.db import models
from university import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
User = get_user_model()

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

class Video(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    video = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)    

    @property
    def get_videoUrl(self):
        if self.video:
             return self.video.url.replace('/media/', settings.MEDIA_URL)
        return ''
    @property
    def get_thumbnailUrl(self):
        if self.thumbnail:
            return self.thumbnail.url.replace('/media/', settings.MEDIA_URL)
        return ''
    def __str__(self):
        return self.title
    
    def time_since_created(self):
        return format_time_since_created(self.created_at)

class Comment(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    comment = models.TextField()

    def time_since_created(self):
        return format_time_since_created(self.created_at)

    def __str__(self):
        return self.comment
    
class Like(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    like = models.BooleanField(default=False)

    def time_since_created(self):
        return format_time_since_created(self.created_at)

    def __str__(self):
        return self.video.title

class Article(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='articles/', null=True, blank=True)

    def __str__(self):
        return self.title