from django. urls import path
from .views import *



urlpatterns = [
    path('add_collaborator_to_note/<int:username>/<int:noteid>/', add_collaborator_to_note, name='add_collaborator_to_note'),
    path('updateNotesColor/<int:noteid>/', updateNotesColor, name='updateNotesColor'),
    path('delete_event/<int:eventID>/', delete_event, name='delete_event'),
    path('getTodayEvent/<int:username>/', getTodayEvent, name='getTodayEvent'),
    path('update_notification/<str:username>/', update_notification, name='update_notification'),
    path('get_notification_by_user/<str:username>/', get_notification_by_user, name='get_notification_by_user'),
    path('update_event_date/', update_event_date, name='update_event_date'),
    path('calendar/<str:username>/', getCalender_event, name='getCalender_event'),
    path('addevent/<int:user_id>/',addCalender_event,  name='addCalender_event'),
    path('addNotes/',addNotes, name='addNotes'),
    path('getNotes/<int:user_id>/',getNotes, name='getNotes'),
    path('deleteNotes/<int:pk>/',deleteNotes, name='deleteNotes'),
    path('getNotesByID/<int:username>/<int:noteid>/',getNotesByID, name='getNotesByID'),
    path('updateNotes/<int:noteid>/',updateNotes, name='updateNotes'),
    path('updateNotesTitle/<int:noteid>/',updateNotesTitle, name='updateNotesTitle')



   
]