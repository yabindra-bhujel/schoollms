# Generated by Django 4.2.4 on 2023-11-29 05:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0031_studentattended_attendance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendance',
            name='date',
            field=models.DateField(auto_now_add=True),
        ),
    ]