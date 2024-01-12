from django.db import models
from university import settings
from django.contrib.auth import get_user_model
User = get_user_model()





class Student(models.Model):
        GENDER = {
            ('Male', 'gender'),
            ('Female', 'Female'),
        }

        user = models.OneToOneField(User, on_delete = models.CASCADE, null=True, blank=True)
        studentID = models.CharField(max_length=255, unique=True, null=False, blank=False,primary_key=True)
        first_name = models.CharField(max_length=255, null= False, blank=False)
        middle_name = models.CharField(max_length=24, null=True , blank=True)
        last_name = models.CharField(max_length=255, null= False, blank=False)
        gender = models.CharField(max_length=20, choices= GENDER, null=False, blank=False)
        date_of_birth = models.DateField(null=False, blank=False)
        email = models.EmailField(max_length=50, null=True, blank=True)
        phone = models.CharField(max_length=20, unique=True)
        image = models.ImageField(upload_to='images/', null=True, blank=True, default="/images/student.png")
        department = models.ForeignKey('courses.Department', on_delete=models.PROTECT, null=True)

        # student address section
        country = models.CharField(max_length=255, null=True, blank=True)
        state = models.CharField(max_length=255,null=True, blank=True)
        city = models.CharField(max_length=255, null=True, blank=True)
        zip_code = models.CharField(max_length=255, null=True, blank=True)


        @property
        def get_imageUrl(self):
                if self.image:
                    return self.image.url.replace('/media/', settings.MEDIA_URL)
                return ''
        
        

        

    
        def __str__(self):
            return self.studentID + " " + self.last_name 


class Parent(models.Model):
      student = models.ForeignKey(Student, on_delete=models.CASCADE)
      father_name = models.CharField(max_length=255,null=True, blank=True)
      mother_name = models.CharField(max_length=255, null=True, blank=True )
      parent_phone = models.CharField(max_length=20, null= False)
      parent_email = models.EmailField(max_length=30, null=False)


      def __str__(self):
        return self.student.studentID + " " + self.father_name 