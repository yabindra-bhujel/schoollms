# Generated by Django 4.2.4 on 2024-03-15 10:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('teacher', '0078_alter_teacher_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teacher',
            name='gender',
            field=models.CharField(choices=[('Female', 'Female'), ('Male', 'Male')], default='Male', max_length=20),
        ),
    ]