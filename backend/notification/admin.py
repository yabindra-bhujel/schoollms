from django.contrib import admin

# Register your models here.

from .models import *

admin.site.register(CalenderModel)
admin.site.register(NotificationModel)
admin.site.register(Notes)
admin.site.register(UserNotification)