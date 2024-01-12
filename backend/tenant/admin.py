from django.contrib import admin

# Register your models here.
from .models import User,UniversityLoginScreenInfo, UserProfile

admin.site.register(User)
admin.site.register(UniversityLoginScreenInfo)
admin.site.register(UserProfile)