from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Exam)
admin.site.register(ShortAnswerQuestion)
admin.site.register(LongAnswerQuestion)
admin.site.register(Question)

admin.site.register(ShortAnswerModel)
admin.site.register(LongAnswerModel)


