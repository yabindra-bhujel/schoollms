# Generated by Django 4.2.4 on 2023-08-14 16:47

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Assignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assignment_title', models.CharField(max_length=255)),
                ('assignment_description', models.TextField()),
                ('assignment_deadline', models.DateTimeField()),
                ('assignment_posted_date', models.DateField(default=django.utils.timezone.now)),
                ('assignment_posted_time', models.TimeField(default=django.utils.timezone.now)),
                ('assignment_type', models.CharField(choices=[('File', 'File'), ('Text', 'Text'), ('TextAndFile', 'TextAndFile')], default='File', max_length=20)),
                ('is_active', models.BooleanField(default=True)),
                ('submission_count', models.PositiveIntegerField(default=0)),
                ('additional_info', models.TextField(blank=True, null=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('max_grade', models.PositiveIntegerField(default=100)),
                ('assignment_start_date', models.DateField(blank=True, null=True)),
                ('assignment_start_time', models.TimeField(default=django.utils.timezone.now)),
                ('assignment_duration', models.DurationField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Attendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('isPresent', models.BooleanField(default=False)),
                ('attendance_code', models.CharField(blank=True, max_length=30, null=True)),
                ('qrcode_image', models.ImageField(blank=True, null=True, upload_to='qr_code')),
            ],
        ),
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Department_name', models.CharField(max_length=50, null=True)),
                ('Department_code', models.CharField(max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='FileSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assignment_submission_file', models.FileField(blank=True, null=True, upload_to='file_submission')),
                ('submission_datetime', models.DateTimeField(auto_now_add=True)),
                ('is_submited', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='FileTextSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assignment_submission_file', models.FileField(blank=True, null=True, upload_to='file_submission')),
                ('assignment_submission_text', models.TextField()),
                ('submission_time', models.DateTimeField(auto_now_add=True)),
                ('is_submited', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='ImageSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assignment_submission_image', models.ImageField(blank=True, null=True, upload_to='image_submission')),
                ('submission_time', models.DateTimeField(auto_now_add=True)),
                ('is_submited', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject_name', models.CharField(max_length=255)),
                ('subject_code', models.CharField(max_length=255)),
                ('subject_description', models.TextField()),
                ('weekday', models.CharField(choices=[('Monday', 'Monday'), ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'), ('Thursday', 'Thursday'), ('Friday', 'Friday'), ('Saturday', 'Saturday')], max_length=20)),
                ('period_start_time', models.CharField(choices=[('9:00', '9:00'), ('10:40', '10:40'), ('13:00', '13:00'), ('14:40', '14:40')], max_length=20)),
                ('period_end_time', models.CharField(choices=[('10:30', '10:30'), ('12:10', '12:10'), ('14:30', '14:30'), ('16:10', '16:10')], max_length=20)),
                ('class_room', models.CharField(choices=[('U101', 'U101'), ('U202', 'U202'), ('U104', 'U104'), ('U506', 'U506')], max_length=20)),
                ('class_period', models.CharField(choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5'), ('6', '6')], default='1', max_length=2)),
            ],
        ),
        migrations.CreateModel(
            name='SubjectEnroll',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='TextSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assignment_submission_text', models.TextField()),
                ('submission_time', models.DateTimeField(auto_now_add=True)),
                ('is_submited', models.BooleanField(default=False)),
                ('assignment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='text_submissions', to='courses.assignment')),
            ],
        ),
    ]