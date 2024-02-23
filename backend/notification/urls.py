from django. urls import path
from .views import *



urlpatterns = [
    path('add_collaborator_to_note/<int:noteid>/', addCollaboratorToNote, name='add_collaborator_to_note'),
    path('updateNotesColor/<int:noteid>/', updateNotesColor, name='updateNotesColor'),
    path('delete_event/<int:eventID>/', deleteEvent, name='delete_event'),
    path('getTodayEvent/<int:username>/', getTodayEvent, name='getTodayEvent'),
    path('update_notification/<str:username>/', update_notification, name='update_notification'),
    path('get_notification_by_user/<str:username>/', get_notification_by_user, name='get_notification_by_user'),
    path('update_event_date/', updateEvent, name='update_event_date'),
    path('calendar/', getCalenderEvent, name='getCalender_event'),
    path('addevent/',addCalenderEvent,  name='addCalender_event'),
    path('addNotes/',addNotes, name='addNotes'),
    path('getNotes/',getNotes, name='getNotes'),
    path('deleteNotes/<int:pk>/',deleteNotes, name='deleteNotes'),
    path('getNotesByID/<int:username>/<int:noteid>/',getNotesByID, name='getNotesByID'),
    path('updateNotes/<int:noteid>/',updateNotes, name='updateNotes'),
    path('updateNotesTitle/<int:noteid>/',updateNotesTitle, name='updateNotesTitle')



   
]