from django.core.management.base import BaseCommand
from django.db import connection
from tenant_schemas.utils import schema_context
from django.contrib.auth import get_user_model
import sys

class Command(BaseCommand):
    help = 'Create a superuser for a specific schema'

    def add_arguments(self, parser):
        parser.add_argument('--schema', dest='schema', help='Specify the schema name')
        parser.add_argument('--username', dest='username', help='Admin username')
        parser.add_argument('--email', dest='email', help='Admin email')
        parser.add_argument('--password', dest='password', help='Admin password')

    def handle(self, *args, **options):
        schema_name = options['schema']
        username = options['username']
        email = options['email']
        password = options['password']

        try:
            with schema_context(schema_name):
                connection.set_schema(schema_name)

                User = get_user_model()
                User.objects.create_superuser(username, email, password)

                connection.set_schema_to_public()

            self.stdout.write(self.style.SUCCESS('Superuser created successfully.'))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error creating superuser: {str(e)}'))
            sys.exit(1)





