
from django.conf import Settings
from django.db import models
from django.contrib.auth.models import AbstractUser

from university import settings


class User(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)

    class Meta:
        swappable = 'AUTH_USER_MODEL'
    
    # Add related_name arguments to avoid clash with auth.User
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
    image = models.ImageField(upload_to="user_profile/", null=True, blank=True, default="/defult.png")
    upload_at = models.DateTimeField(auto_now_add=True)
    cover_image = models.ImageField(upload_to="user_cover/", null=True, blank=True)


    @property
    def image_url(self):
        if self.image:
            return self.image.url.replace('/media/', settings.MEDIA_URL)
        
        
    @property
    def get_cover_image_url(self):
        if self.cover_image:
            return self.cover_image.url.replace('/media/', settings.MEDIA_URL)
        


    def __str__(self):
        return self.user.username






class UniversityLoginScreenInfo(models.Model):
    login_screen_info = models.TextField()
    login_screnn_icon_one = models.ImageField(upload_to="university_icon/")
    login_screnn_icon_two = models.ImageField(upload_to="university_icon/")
    university_full_name = models.CharField(max_length=255)


    @property
    def login_screnn_icon_one_url(self):
        if self.login_screnn_icon_one and hasattr(self.login_screnn_icon_one, 'url'):
            return self.login_screnn_icon_one.url
        
    @property
    def login_screnn_icon_two_url(self):
        if self.login_screnn_icon_two and hasattr(self.login_screnn_icon_two, 'url'):
            return self.login_screnn_icon_two.url

    def __str__(self):
        return f"University Login Screen Info - {self.university_full_name}"

    




class ApplicationSettings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_dark_mode = models.BooleanField(default=False)
    is_notification = models.BooleanField(default=False)
    isTwoFactorAuthEnabled = models.BooleanField(default=False)
    isEmailNotification = models.BooleanField(default=False)

    def __str__(self):
        return f" {self.user.username} - Application Settings"
