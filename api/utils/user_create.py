from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from accounts.models import UserProfile, ApplicationSettings
from django.db import transaction


User = get_user_model()

class UserCreator:
    def __init__(self, is_student: bool, is_teacher: bool, username: str, data: dict, password: str):
        self._data = data
        self._user = None
        self._is_student = is_student
        self._is_teacher = is_teacher
        self._username = username
        self._password = password

    def create_user(self):
        """
        Creates a new user along with associated UserProfile and ApplicationSettings.
        
        Returns:
            User: The created User instance.
        """
        try:
            with transaction.atomic():
                self._create_user()
                self._create_user_profile()
                self._create_application_settings()

                return self._user
        
        except ValidationError as e:
            raise e 

    def _create_user(self):
        first_name = self._data.get('first_name')
        if first_name is None:
            raise ValidationError("First name is missing")

        if self._username is None:
            raise ValidationError("Username is missing")

        email = first_name + self._username + '@gmail.com'
        
        self._user = User.objects.create(
            username=self._username,
            email=email,
            first_name=first_name,
            last_name=self._data.get('last_name'),
            is_student=self._is_student,
            is_teacher=self._is_teacher
        )
        self._user.set_password(self._password)
        self._user.save()

    def _create_user_profile(self):
        UserProfile.objects.create(user=self._user)

    def _create_application_settings(self):
        ApplicationSettings.objects.create(user=self._user)
