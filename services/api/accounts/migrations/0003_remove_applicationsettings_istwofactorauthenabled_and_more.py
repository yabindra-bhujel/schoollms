# Generated by Django 4.2.4 on 2024-10-29 12:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_userprofile_applicationsettings'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='applicationsettings',
            name='isTwoFactorAuthEnabled',
        ),
        migrations.RemoveField(
            model_name='applicationsettings',
            name='is_dark_mode',
        ),
        migrations.RemoveField(
            model_name='applicationsettings',
            name='is_notification',
        ),
    ]