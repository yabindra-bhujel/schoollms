from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Teacher

User = get_user_model()

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'

