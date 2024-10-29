from ..models import Notes
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Q
from accounts.models import UserProfile
from rest_framework.request import Request
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
        note.tag = data['tag']
        note.save()
        return note
    
    @staticmethod
    def share_note_with_user(user, note, data):
        
        with transaction.atomic():
            if note.note_type == 'private':
                note.note_type = 'shared'
                note.save() 
            
            for username in data:
                user = User.objects.get(username=username)
                note.shared_with.add(user)
                note.save()

        return note
    
    @staticmethod
    def get_collaborators(note: Notes, request: Request):
        collaborators = []
        users = note.shared_with.all()

        for user in users:
            userProfile = UserProfile.objects.get(user=user)

            collaborator_info = {
                'fullname': f"{user.first_name} {user.last_name}",
                'username': user.username,
                'email': user.email,
                'profile_image': request.build_absolute_uri(userProfile.image_url)
            }

            collaborators.append(collaborator_info)

        return collaborators
    
    @staticmethod
    def get_shareable_users(note: Notes, request: Request):
        shareable_users = []
        users = User.objects.all()

        # if user is already a collaborator, exclude them from the list but add self.user
        for user in note.shared_with.all():
            users = users.exclude(id=user.id)


        

        for user in users:
            userProfile = UserProfile.objects.get(user=user)

            shareable_user_info = {
                'fullname': f"{user.first_name} {user.last_name}",
                'username': user.username,
                'email': user.email,
                'profile_image': request.build_absolute_uri(userProfile.image_url)
            }

            shareable_users.append(shareable_user_info)

        return shareable_users


    