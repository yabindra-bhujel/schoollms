# Generated by Django 4.2.4 on 2024-10-14 07:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('teachers', '0015_alter_teacher_gender'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='teacher',
            name='address',
        ),
        migrations.RemoveField(
            model_name='teacher',
            name='phone',
        ),
    ]
