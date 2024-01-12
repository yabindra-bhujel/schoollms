from django.contrib import admin
from .models import *



# Register your models here.
admin.site.register(Department)
admin.site.register(Subject)
admin.site.register(SubjectEnroll)
admin.site.register(Assignment)
admin.site.register(FileSubmission)
admin.site.register(TextSubmission)
admin.site.register(CourseMateriales)
admin.site.register(AssignmentFile)
admin.site.register(TextAssigemntQuestion)
admin.site.register(TextAnswer)
admin.site.register(Announcement)
admin.site.register(AnnouncementFile)




admin.site.register(Attendance)
admin.site.register(StudentAttended)




