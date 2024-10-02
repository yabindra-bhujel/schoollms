from django.contrib import admin

from .subjects.models import *

from .attendance.models import *

# Register your models here.

from .models import *

admin.site.register(Department)
admin.site.register(Subject)
admin.site.register(SubjectRegistration)

admin.site.register(Assignment)
admin.site.register(TextAssigemntQuestion)
admin.site.register(AssignmentFile)
admin.site.register(FileSubmission)


admin.site.register(CourseMateriales)

admin.site.register(Announcement)


admin.site.register(Syllabus)
admin.site.register(SyllabusItem)

admin.site.register(Attendance)
admin.site.register(StudentAttended)
