from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.conf import settings
User = get_user_model()

class Teacher(models.Model):

    user = models.OneToOneField(User, on_delete = models.CASCADE, null=True, blank=True)
    teacher_id = models.CharField(max_length=255, unique=True, null=False, blank=False, primary_key=True)
    first_name = models.CharField(max_length=255, null= False, blank=False, default="")
    last_name = models.CharField(max_length=255, null= False, blank=False,default="")
    gender = models.CharField(max_length=20, null=False, blank=False)
    email = models.EmailField(max_length=50,  null=True, blank=True)
    date_of_birth = models.DateField(null=True)
    image = models.ImageField(upload_to='images/', null=True, blank=True)

    def __str__(self):
        return self.first_name + " " + self.last_name
    
    @property
    def image_url(self):
        if self.image:
            return self.image.url.replace('/media/', settings.MEDIA_URL)
        return ''