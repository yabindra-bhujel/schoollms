# Generated by Django 4.2.4 on 2023-09-30 14:50

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('editer', '0004_codeproblem_excepted_answere'),
    ]

    operations = [
        migrations.AlterField(
            model_name='codeproblem',
            name='excepted_answere',
            field=models.TimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]