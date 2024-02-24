from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from student.models import  Student
from teacher.models import Teacher
from .serializers import UserSerializer, UniversityLoginScreenInfoSerializer, UserProfileSerializer, AdminUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes, authentication_classes,parser_classes
from .models import *
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings

class BlacklistRefreshView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response("Success", status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_200_OK )

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
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'response': 'invalid request.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    try:
        username = request.user.username
        user = User.objects.get(username=username)

        try:
                profile = UserProfile.objects.get(user=user)
                profile_serializer = UserProfileSerializer(profile)
        except UserProfile.DoesNotExist:
                profile = None  
                profile_serializer = None
        user_data = {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
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
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def updateProfilePicture(request):   
    try:
        user = request.user
        profile = UserProfile.objects.get(user=user)
        
        image_file = request.FILES.get('image', None)

        if image_file:
            profile.image = image_file
            profile.save()
            return Response({"success": "Profile picture updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No image file provided"}, status=status.HTTP_400_BAD_REQUEST)

    except UserProfile.DoesNotExist:
        return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def changePassword(request):
     try:
        user = request.user

        old_password = request.data['oldPassword']
        new_password = request.data['newPassword']
        confirm_password = request.data['confirmPassword']

        if new_password != confirm_password:
            return Response({"error": "Password does not match"}, status= status.HTTP_400_BAD_REQUEST)
        

        # Check old password
        if not user.check_password(old_password):
            return Response({"error": "Old password is not correct"}, status= status.HTTP_400_BAD_REQUEST)
        



        user.set_password(new_password)
        user.save()


        return Response({"success": "Password changed successfully"}, status= status.HTTP_200_OK)
     except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_user_list(request):
     try:
          user = User.objects.all()
          serializer = AdminUserSerializer(user, many=True)
          return Response(serializer.data)
     except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def profileDetails(request):
    try:
        user = request.user
        user_obj = User.objects.get(username=user)
        is_student = user_obj.is_student
        is_teacher = user_obj.is_teacher
        teacher_data = []
        student_data = []

        if is_teacher:
            teacher = Teacher.objects.get(user=user_obj)
            teacher_data.append({
                "phone": teacher.phone,
                "address": teacher.address,
                "date_of_birth": teacher.date_of_birth,
                "gender": teacher.gender
                })

        if is_student:
            student = Student.objects.get(user=user_obj)
            student_data.append({
                 "gender": student.gender,
                    "date_of_birth": student.date_of_birth,
                    "phone": student.phone,
                    "country": student.country,
                    "state": student.state,
                    "city": student.city,
                    "zip_code": student.zip_code
                    })

        final_data = {
            "user": {
                "username": user_obj.username,
                "email": user_obj.email,
                "first_name": user_obj.first_name,
                "last_name": user_obj.last_name,
            },
            **({"teacher_data": teacher_data} if is_teacher else {}),
            **({"student_data": student_data} if is_student else {}),
        }

        return Response(final_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def upadteUserInfo(request):
    try:
        user = request.user
        first_name = request.data['first_name']
        last_name = request.data['last_name']
        email = request.data['email']
        try:
            user = User.objects.get(username=user)
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.save()
        except User.DoesNotExist as e:
            print(e)
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)
     
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def reset_password(request):
    try:
        email = request.data['email']
        username = request.data['username']
        try:
            user = User.objects.get(email=email, username=username)
        except User.DoesNotExist as e:
            print(e)
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
       # Generate Password Reset Token
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        if isinstance(uidb64, bytes):
            uidb64 = uidb64.decode('utf-8')
        reset_link = settings.FRONTEND_URL + "/reset_password/" + uidb64 + "/" + token

        app_name = settings.APP_NAME
        message = f'Hi {user.username},\n\nPlease click on the link below to reset your password:\n\n{reset_link}\n\nThanks!'
        recipient_list = [user.email]
        email_from = settings.EMAIL_HOST_USER
        subject = f"Password Reset Request for {app_name}"
        message = f'Hi {user.username},\n\nWe received a request to reset the password for your {app_name} account. If you made this request, please set a new password by clicking on the link below:\n {reset_link}\n\nThis link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact our support team if you have any concerns.\n\nThanks!\n{app_name} Team'

        try:
            send_mail(subject, message, email_from, recipient_list)
            return Response({"success": "Password reset link sent successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def conform_reset_password(request, uuid, token):
    try:
        uid = force_text(urlsafe_base64_decode(uuid))
        user = User.objects.get(pk=uid)

        token_generator = PasswordResetTokenGenerator()
        if token_generator.check_token(user, token):
            new_password = request.data['password']
            confirm_password = request.data['confirmPassword']

            if new_password != confirm_password:
                return Response({"error": "Password does not match"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            return Response({"success": "Password reset successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Token is invalid"}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist as e:
        print(e)
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def check_have_two_factor_auth(request):
    try:
        user_settings = ApplicationSettings.objects.get(user=request.user)
        two_factor_auth = user_settings.isTwoFactorAuthEnabled

        return Response({"two_factor_auth": two_factor_auth}, status=status.HTTP_200_OK)
    except ApplicationSettings.DoesNotExist:
        return Response({"two_factor_auth": False}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def haveEmailNotification(request):
    try:
        user_settings = ApplicationSettings.objects.get(user=request.user)
        email_notifaction = user_settings.isEmailNotification

        return Response({"is_email_notification": email_notifaction}, status=status.HTTP_200_OK)
    except ApplicationSettings.DoesNotExist:
        return Response({"is_email_notification": False}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_two_factor_auth(request):
    try:
        user_settings = ApplicationSettings.objects.get(user=request.user)
        two_factor_auth = request.data['two_factor_auth']
        user_settings.isTwoFactorAuthEnabled = two_factor_auth
        user_settings.save()

        return Response({"success": "Two factor authentication updated successfully"}, status=status.HTTP_200_OK)
    except ApplicationSettings.DoesNotExist:
        return Response({"error": "User settings not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def updateEmailNotification(request):
    try:
        user_settings = ApplicationSettings.objects.get(user=request.user)
        email_notification = request.data['emai_notification']
        user_settings.isTwoFactorAuthEnabled = email_notification
        user_settings.save()

        return Response({"success": "Two factor authentication updated successfully"}, status=status.HTTP_200_OK)
    except ApplicationSettings.DoesNotExist:
        return Response({"error": "User settings not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)



