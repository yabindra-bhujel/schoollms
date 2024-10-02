from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserProfile, ApplicationSettings

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['image_url']

class UserSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'image_url']

    def get_image_url(self, instance):
        try:
            user_profile = instance.userprofile_set.get()
            return user_profile.image_url
        except UserProfile.DoesNotExist:
            return None


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'is_superuser', 'is_staff', 'is_student', 'is_teacher', 'is_active', 'date_joined', 'last_login']


class ApplicationSettingsSerializer(serializers.ModelSerializer):
    
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = ApplicationSettings
        fields = '__all__'

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError('Passwords do not match')
        return data