# Generated by Django 4.2.4 on 2023-08-25 07:02

import courses.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0006_coursemateriales'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coursemateriales',
            name='pdf_file',
            field=models.FileField(upload_to=courses.models.UploadToPathAndRename('Materiales')),
        ),
    ]