# Generated by Django 4.2.4 on 2023-11-29 03:33

import datetime
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0051_alter_student_gender'),
        ('courses', '0028_remove_attendance_attendance_code_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='attendance',
            name='attendance_code',
            field=models.CharField(blank=True, max_length=10, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='attendance',
            name='course',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='courses.subject'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='attendance',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='attendance',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='attendance',
            name='students_attended',
            field=models.ManyToManyField(blank=True, null=True, to='courses.studentattended'),
        ),
        migrations.AddField(
            model_name='attendance',
            name='subject_enroll',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='courses.subjectenroll'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='studentattended',
            name='attendance_code',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='studentattended',
            name='is_present',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='studentattended',
            name='student',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='student.student'),
        ),
    ]