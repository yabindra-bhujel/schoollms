from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class Student(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE, null=True, blank=True)
    student_id = models.CharField(max_length=255, unique=True, null=False, blank=False,primary_key=True)
    first_name = models.CharField(max_length=255, null= False, blank=False)
    last_name = models.CharField(max_length=255, null= False, blank=False)
    gender = models.CharField(max_length=20, null=True, blank=True)
    date_of_birth = models.DateField(null=False, blank=False)
    email = models.EmailField(max_length=50, null=True, blank=True)
    image = models.ImageField(upload_to='images/', null=True, blank=True, default="/images/student.png")
    department = models.ForeignKey('courses.Department', on_delete=models.PROTECT, null=True, blank=True)

    @property
    def get_imageUrl(self):
        if self.image:
            return self.image.url.replace('/media/', settings.MEDIA_URL)
            return ''
        
        