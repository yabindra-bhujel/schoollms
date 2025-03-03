from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from .models import *
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
from.serializers import *
from rest_framework.decorators import action
from teachers.models import Teacher
from students.models import Student
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.openapi import OpenApiTypes
from .serializers import BlacklistTokenSerializer

User = get_user_model()

@extend_schema(tags=["Auth"])
class BlacklistRefreshView(APIView):
    serializer_class = BlacklistTokenSerializer

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response("Success", status=status.HTTP_200_OK)
        except Exception as e:
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


@extend_schema(tags=["User"])
class UserViewSet(viewsets.ViewSet):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication] 
    lookup_field = "id"

    def get_permissions(self):
        action_permission_map = {
            'list': [IsAuthenticated],
            'user_profile': [IsAuthenticated],
            'user_profile_details': [IsAuthenticated],
        }

        if self.action in action_permission_map:
            permission_classes = action_permission_map[self.action]
        else:
            permission_classes = [IsAuthenticated, IsAdminUser]

        return [permission() for permission in permission_classes]

    def list(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='admin', url_name='admin')
    def admin(self, request):
        queryset = User.objects.all()
        serializer = AdminUserSerializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the user",
            )
        ],
        responses={200: UserSerializer},
    )
    def retrieve(self, request, id: int = None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, id=id)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user_profile = UserProfile.objects.create(user=serializer.instance)
            user_profile.save()
            application_settings = ApplicationSettings.objects.create(user=serializer.instance)
            application_settings.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the user",
            )
        ],
        responses={200: UserSerializer},
    )
    def update(self, request, id: int= None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, id=id)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the user",
            )
        ],
    )
    def destroy(self, request, id: int = None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, id=id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='profile', url_name='profile')
    def user_profile(self, request):
        username = request.user
        try:
            user_profile = UserProfile.objects.get(user=username)
        except UserProfile.DoesNotExist:
            return Response('User profile does not exist', status=status.HTTP_404_NOT_FOUND)

        user_data = {
            'username': username.username,
            'email': username.email,
            'first_name': username.first_name,
            'last_name': username.last_name,
            }
        if user_profile and user_profile.image:
            user_data['image'] = request.build_absolute_uri(user_profile.image.url)

        return Response(user_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='profile_details', url_name='profile_details')
    def user_profile_details(self, request):
        is_student = request.user.is_student
        is_teacher = request.user.is_teacher

        teacher_data = []
        student_data = []

        if is_teacher:
            teacher = Teacher.objects.get(user=request.user)
            teacher_data.append({
                "date_of_birth": teacher.date_of_birth,
                "gender": teacher.gender
            })

        if is_student:
            student = Student.objects.get(user=request.user)
            student_data.append({
                 "gender": student.gender,
                    "date_of_birth": student.date_of_birth,
                })

        final_data = {
            "user": {
                "username": request.user.username,
                "email": request.user.email,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name,
            },
            **({"teacher_data": teacher_data} if is_teacher else {}),
            **({"student_data": student_data} if is_student else {}),
        }

        return Response(final_data, status=status.HTTP_200_OK)


@extend_schema(tags=["User Profile"])
class UserProfileViewSet(viewsets.ViewSet):
    serializer_class = UserProfileSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    @action(detail=False, methods=['put'], url_path='me', url_name='me')
    def update_profile_picture(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        image_file = request.FILES.get('image', None)
        if image_file:
            user_profile.image = image_file
            user_profile.save()
            return Response('Profile picture updated successfully', status=status.HTTP_200_OK)

    @action(detail=False, methods=['put'], url_path='update_user_profile_info', url_name='update_user_profile')
    def update_user_profile_info(self, request):
        first_name = request.data['first_name']
        last_name = request.data['last_name']
        email = request.data['email']
        user = User.objects.get(username=request.user.username)
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.save()
        userserializer = UserSerializer(user)
        return Response(userserializer.data, status=status.HTTP_200_OK)

@extend_schema(tags=["Application Settings"])
class ApplicationSettingsViewSet(viewsets.ViewSet):
    serializer_class = ApplicationSettingsSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, request):
        user = request.user
        try:
            return ApplicationSettings.objects.get(user=user)
        except UserProfile.DoesNotExist:
            new_application_settings = ApplicationSettings.objects.create(user=user)
            new_application_settings.save()
            return new_application_settings

    @action(detail=False, methods=['put'], url_path='update_setting', url_name='me')
    def update_application_settings(self, request):
        application_settings = self.get_object(request)
        if application_settings.isEmailNotification == True:
            application_settings.isEmailNotification = False
        else:
            application_settings.isEmailNotification = True
        application_settings.save()
        
        return Response('Application settings updated successfully', status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='have_email_notification', url_name='have_email_notification')
    def check_have_email_notification(self, request):
        application_settings = self.get_object(request)
        return Response(application_settings.isEmailNotification, status=status.HTTP_200_OK)

@extend_schema(tags=["Password Reset"])
class PasswordResetViewzSet(viewsets.ViewSet):
    serializer_class = PasswordChangeSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


    @action(detail=False, methods=['post'])
    def chnage_password(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.data.get('old_password')):
                return Response({'old_password': 'Wrong password.'}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get('new_password'))
            user.save()
            return Response('Password changed successfully.', status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    @action(detail=False, methods=['post'], url_path='reset', url_name='reset')
    def reset_password(self, request):
        email = request.data.get('email')
        username = request.data.get('username')
        try:
            user = User.objects.get(email=email, username=username)
        except User.DoesNotExist:
            return Response('User not found', status=status.HTTP_404_NOT_FOUND)
        
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        if isinstance(uidb64, bytes):
            uidb64 = uidb64.decode('utf-8')
        reset_link = settings.FRONTEND_URL + "/reset_password/" + uidb64 + "/" + token

        app_name = settings.APP_NAME
        subject = f"Password Reset Request for {app_name}"
        message = self._get_email_message(user, reset_link, app_name)

        try:
            send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])
            return Response('Email sent', status=status.HTTP_200_OK)
        except Exception as e:
            return Response('Email not sent', status=status.HTTP_400_BAD_REQUEST)
    

    def _get_email_message(self, user, reset_link, app_name):

        return f"""Hi {user.username},

        We received a request to reset the password for your {app_name} account. If you made this request, please set a new password by clicking on the link below:

        {reset_link}

        This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact our support team if you have any concerns.

        Thanks!
        {app_name} Team"""
    

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="uidb64",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="User ID",
            ),
            OpenApiParameter(
                name="token",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description="Token",
            )
        ],
    )
    @action(detail=False, methods=['post'], url_path='conform_reset_password/<uidb64>/<token>', url_name='conform_reset_password')
    def conform_reset_password(self, request, uidb64: str, token: str):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception as e:
            user = None

        token_generator = PasswordResetTokenGenerator()
        if token_generator.check_token(user, token):
            new_password = request.data['password']
            confirm_password = request.data['confirm_password']

            if new_password != confirm_password:
                return Response('Passwords do not match', status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(new_password)
            user.save()
            return Response('Password reset successfully', status=status.HTTP_200_OK)
        return Response('Password reset link is invalid.', status=status.HTTP_400_BAD_REQUEST)
