# Generated by Django 4.2.4 on 2024-03-31 08:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('common', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='Title')),
                ('content', models.TextField(verbose_name='Content')),
                ('note_type', models.CharField(choices=[('private', 'Private'), ('shared', 'Shared')], default='private', max_length=20, verbose_name='Note Type')),
                ('date', models.DateTimeField(auto_now_add=True, verbose_name='Date Created')),
                ('color', models.CharField(blank=True, max_length=20, null=True, verbose_name='Color')),
                ('shared_with', models.ManyToManyField(blank=True, related_name='shared_notes', to=settings.AUTH_USER_MODEL, verbose_name='Shared With')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
            options={
                'verbose_name': 'Note',
                'verbose_name_plural': 'Notes',
            },
        ),
    ]