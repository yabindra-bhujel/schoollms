# myapp/management/commands/my_custom_command.py
from django.core.management.base import BaseCommand
from courses.tasks import print_hello_world

class Command(BaseCommand):
    help = 'Starts the print_hello_world task'

    def handle(self, *args, **options):
        print_hello_world.delay()
        self.stdout.write(self.style.SUCCESS('Task started successfully!'))
