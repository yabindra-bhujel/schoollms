# Generated by Django 4.2.4 on 2023-11-15 07:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('teacher', '0031_alter_teacher_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teacher',
            name='gender',
            field=models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], default='Male', max_length=20),
        ),
    ]