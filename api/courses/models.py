from django.db import models

class Department(models.Model):
    department_name = models.CharField(max_length=255, null=False, blank=False)
    department_code = models.CharField(max_length=255, null=False, blank=False)

    def __str__(self):
        return self.department_name
