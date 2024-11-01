# Generated by Django 4.2.4 on 2024-10-29 03:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0003_notification_usernotification'),
    ]

    operations = [
        migrations.CreateModel(
            name='NoteTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='Name')),
                ('notes', models.ManyToManyField(related_name='tags', to='common.notes', verbose_name='Notes')),
            ],
            options={
                'verbose_name': 'Note Tag',
                'verbose_name_plural': 'Note Tags',
            },
        ),
    ]
