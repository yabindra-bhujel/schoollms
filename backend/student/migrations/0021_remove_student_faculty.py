# Generated by Django 4.2.4 on 2023-10-24 12:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0020_alter_student_gender'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='faculty',
        ),
    ]