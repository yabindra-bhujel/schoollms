# Generated by Django 4.2.4 on 2023-08-14 16:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('courses', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('studentID', models.CharField(max_length=255, primary_key=True, serialize=False, unique=True)),
                ('first_name', models.CharField(max_length=255)),
                ('middle_name', models.CharField(blank=True, max_length=24, null=True)),
                ('last_name', models.CharField(max_length=255)),
                ('gender', models.CharField(choices=[('Female', 'Female'), ('Male', 'Male')], max_length=20)),
                ('date_of_birth', models.DateField()),
                ('email', models.EmailField(blank=True, max_length=50, null=True)),
                ('phone', models.CharField(max_length=20, unique=True)),
                ('image', models.ImageField(blank=True, default='/images/student.png', null=True, upload_to='images/')),
                ('country', models.CharField(blank=True, max_length=255, null=True)),
                ('state', models.CharField(blank=True, max_length=255, null=True)),
                ('city', models.CharField(blank=True, max_length=255, null=True)),
                ('zip_code', models.CharField(blank=True, max_length=255, null=True)),
                ('faculty', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='courses.subject')),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Parent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('father_name', models.CharField(blank=True, max_length=255, null=True)),
                ('mother_name', models.CharField(blank=True, max_length=255, null=True)),
                ('parent_phone', models.CharField(max_length=20)),
                ('parent_email', models.EmailField(max_length=30)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='student.student')),
            ],
        ),
    ]