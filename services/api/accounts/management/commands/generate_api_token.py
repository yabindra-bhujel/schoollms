from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
import requests

User = get_user_model()


class Command(BaseCommand):
    help = "Create a new user and generate an API token"

    def add_arguments(self, parser):
        parser.add_argument("username", type=str, help="Username for the new user")
        parser.add_argument("password", type=str, help="Password for the new user")
        parser.add_argument("-admin", action="store_true", help="Create an admin user")
        parser.add_argument(
            "-student", action="store_true", help="Create a student user"
        )
        parser.add_argument(
            "-teacher", action="store_true", help="Create a teacher user"
        )

    def handle(self, *args, **options):
        username = options["username"]
        password = options["password"]

        roles = ["admin", "student", "teacher"]
        selected_roles = [role for role in roles if options[role]]

        if len(selected_roles) > 1:
            raise CommandError("Please specify only one role: -admin, -student, or -teacher")

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'User "{username}" already exists. Attempting to log in...'))
            try:
                token = self._login(username, password)
                self.stdout.write(self.style.SUCCESS(f"Successfully logged in as {username}"))
                self.stdout.write(self.style.SUCCESS(f"API Token: {token}"))
            except CommandError as e:
                raise CommandError(f"Login failed: {str(e)}")
            return

        role = None
        if options["admin"]:
            role = "admin"
        elif options["student"]:
            role = "student"
        elif options["teacher"]:
            role = "teacher"

        try:
            user = self._create_user(username, password, role)
            self.stdout.write(self.style.SUCCESS(f"{role.capitalize()} user {username} created successfully"))
        except Exception as e:
            raise CommandError(f"Failed to create user: {str(e)}")

        try:
            token = self._login(username, password)
            self.stdout.write(self.style.SUCCESS(f"Successfully logged in as {username}"))
            self.stdout.write(self.style.SUCCESS(f"API Token: {token}"))
        except CommandError as e:
            raise CommandError(f"Login failed: {str(e)}")

    def _create_user(self, username: str, password: str, role: str) -> User:
        """
        Creates a user with the specified role.
        """
        user = User.objects.create_user(username=username, password=password)
        if role == "admin":
            user.is_staff = True
            user.is_superuser = True
        elif role == "student":
            user.is_student = True
        elif role == "teacher":
            user.is_teacher = True
        user.save()
        return user

    def _login(self, username: str, password: str) -> str:
        """
        Logs in a user and retrieves an API token.
        """
        data = {"username": username, "password": password}
        response = requests.post("http://127.0.0.1:8000/api/login/", data=data)
        if response.status_code == 200:
            return response.json().get("access")
        else:
            raise CommandError(f"Failed to log in: {response.content.decode()}")
