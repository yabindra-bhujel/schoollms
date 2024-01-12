from django.contrib import admin
from .models import CodeProblem, UserProblemCompletion

admin.site.register(CodeProblem)
admin.site.register(UserProblemCompletion)

# Register your models here.
