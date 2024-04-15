from django.contrib import admin

# Register your models here.

from .models import *

from .socials.models import Message, Group, GroupMessage


admin.site.register(CalendarEvent)

admin.site.register(Message)

admin.site.register(Group)

admin.site.register(GroupMessage)
