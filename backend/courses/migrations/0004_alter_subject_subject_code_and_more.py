# Generated by Django 4.2.4 on 2023-08-15 04:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_alter_department_department_code_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subject',
            name='subject_code',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='subject',
            name='subject_name',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]