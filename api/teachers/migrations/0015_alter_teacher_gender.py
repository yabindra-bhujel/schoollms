# Generated by Django 4.2.4 on 2024-04-18 13:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('teachers', '0014_alter_teacher_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teacher',
            name='gender',
            field=models.CharField(max_length=20),
        ),
    ]