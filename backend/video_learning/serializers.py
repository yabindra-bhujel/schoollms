from rest_framework import serializers
from.models import *
from tenant.models import User
from tenant.serializers import  UserProfileSerializer



class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email',  'first_name', 'last_name']




class VideoSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Video
        fields = '__all__'



class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    # user_profile = UserProfileSerializer(source='user.userprofile')

    class Meta:
        model = Comment
        fields = '__all__'


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    # profile=UserProfileSerializer()
    class Meta:
        model = Like
        fields = '__all__'

        




