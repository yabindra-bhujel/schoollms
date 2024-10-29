from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class User(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)

    class Meta:
        swappable = 'AUTH_USER_MODEL'
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='user_custom_set',
        blank=True,
        verbose_name='groups',
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_query_name='user_custom',
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='user_custom_set',
        blank=True,
        verbose_name='user permissions',
        help_text='Specific permissions for this user.',
        related_query_name='user_custom',
    )

class UserProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="userProfile/", null=True, blank=True, default="userProfile/defutlUser.png")
    upload_at = models.DateTimeField(auto_now_add=True)

    @property
    def image_url(self):
        if self.image:
            return self.image.url.replace('/media/', settings.MEDIA_URL)
        
    def __str__(self):
        return self.user.username
    
class ApplicationSettings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    isEmailNotification = models.BooleanField(default=False)

    def __str__(self):
        return f" {self.user.username} - Application Settings"
