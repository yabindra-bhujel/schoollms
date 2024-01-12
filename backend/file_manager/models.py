from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
class Folder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    date_created = models.DateField(auto_now_add=True)


    def __str__(self):
        return self.name
    
    def total_file_count(self):
        # Calculate the total number of files in this folder
        return self.file_set.count()
    
    def total_file_size(self):
        # Calculate the total size of files in this folder
        total_size = 0
        for file in self.file_set.all():
            total_size += file.size
        return total_size
    
    def formatted_size(self):
        # Calculate and format the total size of files within this folder
        total_size_bytes = sum(file.size for file in self.file_set.all())
        if total_size_bytes < 1024:
            return f"{total_size_bytes} bytes"
        elif total_size_bytes < 1024 * 1024:
            return f"{total_size_bytes / 1024:.2f} KB"
        elif total_size_bytes < 1024 * 1024 * 1024:
            return f"{total_size_bytes / (1024 * 1024):.2f} MB"
        else:
            return f"{total_size_bytes / (1024 * 1024 * 1024):.2f} GB"
        
        

class FileUpload(models.Model):
    file = models.FileField(upload_to='file_manager/')

    

class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE)
    size = models.BigIntegerField()  # Size in bytes
    date_created = models.DateField(auto_now_add=True)
    file_content = models.ManyToManyField(FileUpload, related_name="file_manager", blank=True)  



   

    def __str__(self):
        return self.folder.name

   
    