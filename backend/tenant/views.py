from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import UserSerializer, UniversityLoginScreenInfoSerializer, UserProfileSerializer, AdminUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import UniversityLoginScreenInfo, UserProfile
from django.contrib.auth import get_user_model
import pyotp
User = get_user_model()
from datetime import datetime, timedelta
from django.utils.dateparse import parse_datetime
import jwt
from django.conf import settings
from rest_framework.views import APIView


from rest_framework_simplejwt.tokens import RefreshToken

class BlacklistRefreshView(APIView):
    def post(self, request):
        token = RefreshToken(request.data.get('refresh'))
        token.blacklist()
        return Response("Success")
    


class UserTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['is_student'] = user.is_student
        token['is_teacher'] = user.is_teacher
        token['is_superuser'] = user.is_superuser
        token['is_staff'] = user.is_staff

        return token
    
class UserTokenObtainPairView(TokenObtainPairView):

    serializer_class = UserTokenObtainPairSerializer


class UserViewset(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()





def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }




@api_view(['POST'])
def create_new_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            data = {
                'response': 'successfully registered new user.',
                'username': user.username,
                'tokens': get_tokens_for_user(user)
            }
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            data = serializer.errors
            print(data)  # Add this line to print serializer errors
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'response': 'invalid request.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['GET'])
def get_university_login_screen_info(request):
    serializer = UniversityLoginScreenInfoSerializer(UniversityLoginScreenInfo.objects.all().first())
    data = serializer.data
    for img_key in ['login_screnn_icon_one', 'login_screnn_icon_two']:
        if img_key in data and data[img_key] is not None:
            data[img_key] = request.build_absolute_uri(data[img_key])
    
    return Response(data)




@api_view(['GET'])
def get_user_profile_pic(request, username):
    try:
        # Retrieve the user based on the provided username
        user = User.objects.get(username=username)

        # Check if the user is a student (you may have your own logic for this)
            # Retrieve the user's profile data
        try:
                profile = UserProfile.objects.get(user=user)
                profile_serializer = UserProfileSerializer(profile)
        except UserProfile.DoesNotExist:
                profile = None  # Set profile to None if it doesn't exist
                profile_serializer = None

            # Serialize user data along with profile data
        user_data = {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                
            }

            # Check if the user has a profile picture and include it in the response
        if profile and profile.image:
                user_data["image"] = request.build_absolute_uri(profile.image.url)

        if profile and profile.cover_image:
                user_data["cover_image"] = request.build_absolute_uri(profile.cover_image.url)


        return Response(user_data)
    except User.DoesNotExist:
        return Response({'response': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
def change_password(request):
     try:
          data = request.data
          user_id = data["user_id"]
          user_email = data["email"]
          old_password = data["old_password"]
          new_password = data["confirm_password"]

          user = User.objects.filter(id= user_id, email = user_email).first()

          if not user:
                return Response({"message": "User not found in this email"})
          
          if not user.check_password(old_password):
                return Response({"message": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
          elif old_password == new_password:
                return Response({"message": "New password is same as old password"}, status=status.HTTP_400_BAD_REQUEST)
          else:
                user.set_password(new_password)
                user.save()
                return Response({"success": "Password changed successfully"}, status= status.HTTP_200_OK)
     except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
     



@api_view(['GET'])
def get_user_list(request, username):
     try:
          user = User.objects.all()
          serializer = AdminUserSerializer(user, many=True)
          return Response(serializer.data)
     except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)