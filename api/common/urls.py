from rest_framework import routers
from django.urls import path, include

from .views import *
from .calendar.views import *
from .notes.views import *
from .notifications.views import *
from .socials.views import *

router = routers.DefaultRouter()

router.register(r'calendar', CalendarEventViewSet, basename='CalendarEvent')
router.register(r'notes', NotesViewSet, basename='Notes')
router.register(r'notifications', NotificationViewSet, basename='UserNotification')
router.register(r'socials', PrivateMessagesViewSet, basename='PrivateMessages')
router.register(r'groups', GroupMessagesViewSet, basename='Group')

urlpatterns = [
    path('', include(router.urls)),

]