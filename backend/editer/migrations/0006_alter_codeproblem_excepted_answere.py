# Generated by Django 4.2.4 on 2023-09-30 14:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('editer', '0005_alter_codeproblem_excepted_answere'),
    ]

    operations = [
        migrations.AlterField(
            model_name='codeproblem',
            name='excepted_answere',
            field=models.TextField(),
        ),
    ]