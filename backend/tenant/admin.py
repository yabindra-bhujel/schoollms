from django.contrib import admin

# Register your models here.
from .models import User,UniversityLoginScreenInfo, UserProfile,ApplicationSettings

admin.site.register(User)
admin.site.register(UniversityLoginScreenInfo)
admin.site.register(UserProfile)
admin.site.register(ApplicationSettings)