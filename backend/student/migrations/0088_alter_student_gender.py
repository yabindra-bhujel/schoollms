# Generated by Django 4.2.4 on 2024-03-03 01:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0087_alter_student_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='gender',
            field=models.CharField(choices=[('Female', 'Female'), ('Male', 'gender')], max_length=20),
        ),
    ]