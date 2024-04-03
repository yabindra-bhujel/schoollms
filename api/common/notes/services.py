from ..models import Notes
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Q
User = get_user_model()

class NotesService:
    MAXNOTES = 10

    @staticmethod
    def new_note(user, data):

        notes_count = Notes.objects.filter(user=user).count()
        if notes_count >= NotesService.MAXNOTES:
            raise Exception("You have reached the maximum number of notes")
        
        note = Notes.objects.create(title=data['title'],content=data['content'],user=user)
        note.save()

        return note
    
    @staticmethod
    def update_note(note, data):
        note.title = data['title']
        note.content = data['content']
        note.save()
        return note
    
    @staticmethod
    def share_note_with_user(user, pk, data):
        note = Notes.objects.get(user=user, id=pk)
        collaborator_usernames = data
        with transaction.atomic():
            if note.note_type == 'private':
                note.note_type = 'shared'
                for username in collaborator_usernames:
                    collaborator = User.objects.get(username=username)
                    note.shared_with.add(collaborator)
                    note.save()

        return note
    