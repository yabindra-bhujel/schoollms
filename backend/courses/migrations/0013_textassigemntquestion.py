# Generated by Django 4.2.4 on 2023-11-15 03:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0012_alter_assignment_assignment_start_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='TextAssigemntQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.TextField()),
                ('assignment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='text_questions', to='courses.assignment')),
            ],
        ),
    ]