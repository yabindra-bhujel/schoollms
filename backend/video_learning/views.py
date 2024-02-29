from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import JWTAuthentication
from tenant.serializers import  UserProfileSerializer
from tenant.models import UserProfile
from notification.models import NotificationModel
User = get_user_model()
import logging
logger = logging.getLogger(__name__)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_videos(request):
    try:
        videos = Video.objects.all()
        video_data = []
        for video in videos:
            video_data_dict = {
                "first_name": video.user.first_name,
                "last_name": video.user.last_name,  
                "id": video.id,
                "title": video.title,
                "description": video.description,
                "video":video.video,
                "created_at": video.created_at,
                "time_since_created": video.time_since_created()}
            if video.video:
                video_data_dict["video"] = request.build_absolute_uri(video.video.url)
            if video.thumbnail:
                video_data_dict["thumbnail"] = request.build_absolute_uri(video.thumbnail.url)
            try:
                user_profile = UserProfile.objects.get(user=video.user)
                user_profile_data = {"image": None}  # Initialize with an empty image field

                if user_profile.image:
                    user_profile_data["image"] = request.build_absolute_uri(user_profile.image.url)

                video_data_dict["user_profile"] = user_profile_data
            except UserProfile.DoesNotExist:
                video_data_dict["user_profile"] = None

            video_data.append(video_data_dict)

        return Response(video_data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def search_video_data(request):
    try:
        query = request.query_params.get('query', '')
        videos = Video.objects.filter(title__icontains=query)
        video_data = []
        for video in videos:
            video_data_dict = {
                "first_name": video.user.first_name,
                "last_name": video.user.last_name,  
                "id": video.id,
                "title": video.title,
                "description": video.description,
                "video":video.video,
                "created_at": video.created_at,
                "time_since_created": video.time_since_created(),}
            if video.video:
                video_data_dict["video"] = request.build_absolute_uri(video.video.url)
            if video.thumbnail:
                video_data_dict["thumbnail"] = request.build_absolute_uri(video.thumbnail.url)
            try:
                user_profile = UserProfile.objects.get(user=video.user)
                user_profile_data = {"image": None}  # Initialize with an empty image field
                if user_profile.image:
                    user_profile_data["image"] = request.build_absolute_uri(user_profile.image.url)
                video_data_dict["user_profile"] = user_profile_data
            except UserProfile.DoesNotExist:
                video_data_dict["user_profile"] = None
            video_data.append(video_data_dict)

        return Response(video_data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_video(request):
    try:
        user_id = request.data["user"]
        user = User.objects.get(id=user_id)
        title = request.data["title"]
        description = request.data["description"]
        video = request.data["video"]
        thumbnail = request.data["thumbnail"]
        try:
            video = Video.objects.create(
                user=user,
                title=title,
                description=description,
                video=video,
                thumbnail=thumbnail,)
            video.save()
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_404_NOT_FOUND)

def serialize_comment_with_user_profile(comment, request):
    comment_serializer = CommentSerializer(comment)
    comment_dict = comment_serializer.data
    try:
        comment_userprofile = UserProfile.objects.get(user=comment.user)
        comment_userprofile_serializer = UserProfileSerializer(comment_userprofile)
        comment_userprofile_data = comment_userprofile_serializer.data
    except UserProfile.DoesNotExist:
        comment_userprofile_data = None

    comment_dict["user_profile"] = comment_userprofile_data

    if ("image" in comment_userprofile_data
        and comment_userprofile_data["image"] is not None):
        comment_userprofile_data["image"] = request.build_absolute_uri(
            comment_userprofile_data["image"])
    return comment_dict

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def video_details(request, id):
    try:
        video = get_object_or_404(Video, id=id)
        video_serializer = VideoSerializer(video)
        video_data = video_serializer.data

        if "video" in video_data and video_data["video"] is not None:
            video_data["video"] = request.build_absolute_uri(video_data["video"])
        if "thumbnail" in video_data and video_data["thumbnail"] is not None:
            video_data["thumbnail"] = request.build_absolute_uri(
                video_data["thumbnail"])
        time_since_created = video.time_since_created()
        video_data["time_since_created"] = time_since_created
        comments = Comment.objects.filter(video=video).order_by('-created_at')
        comment_data = []
        for comment in comments:
            comment_dict = serialize_comment_with_user_profile(comment, request)
            time_since_created = comment.time_since_created()
            comment_dict["time_since_created"] = time_since_created
            comment_data.append(comment_dict)
        video_data["comments"] = comment_data

        likes = Like.objects.filter(video=video)
        like_serializer = LikeSerializer(likes, many=True)
        like_data = like_serializer.data
        like_time_since_created = [like.time_since_created() for like in likes]
        video_data["likes"] = like_data
        video_data["like_time_since_created"] = like_time_since_created
        user_profile = UserProfile.objects.get(user=video.user)
        user_profile_serializer = UserProfileSerializer(user_profile)
        user_profile_data = user_profile_serializer.data
        if "image" in user_profile_data and user_profile_data["image"] is not None:
            user_profile_data["image"] = request.build_absolute_uri(
                user_profile_data["image"])

        video_data["user_profile"] = user_profile_data
        return Response(video_data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_comment(request):
    try:
        video_id = request.data["video_id"]
        comment_text = request.data["comment"]
        user_id = request.data["user"]
        user = User.objects.get(id=user_id)
        video = Video.objects.get(id=video_id)
        comment = Comment.objects.create(video=video, user=user, comment=comment_text)
        comment.save()
        comment_dict = serialize_comment_with_user_profile(comment, request)
        return Response(comment_dict, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_like(request):
    try:
        video_id = request.data["video"]
        user_id = request.data["user"]
        user = User.objects.get(id=user_id)
        video = Video.objects.get(id=video_id)
        existing_like = Like.objects.filter(user=user, video=video).first()
        if existing_like:
            existing_like.delete()
        else:
            try:
                like = Like.objects.create(video=video, user=user, like=True)
                like.save()
            except Exception as e:
                logger.error(e)
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status = status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_article(request, username):
    try:
        user = User.objects.get(username=username)
        title = request.data["title"]
        description = request.data["description"]
        try:
            article = Article.objects.create(user=user,title=title,content=description)
            article.save()
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_article_list(request):
    try:
        articles = Article.objects.all()
        article_data = []
        for article in articles:
            article_data_dict = {
                "first_name": article.user.first_name,
                "last_name": article.user.last_name,  
                "id": article.id,
                "title": article.title,
                "description": article.content,
                "created_at": article.created_at,}
            try:
                user_profile = UserProfile.objects.get(user=article.user)
                user_profile_data = {"image": None}
                if user_profile.image:
                    user_profile_data["image"] = request.build_absolute_uri(user_profile.image.url)
                article_data_dict["user_profile"] = user_profile_data
            except UserProfile.DoesNotExist:
                article_data_dict["user_profile"] = None
            article_data.append(article_data_dict)
        return Response(article_data)
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_article_by_id(request, id):
    try:
        try:
            article = Article.objects.get(id=id)
            article_serializer = ArticleSerializer(article)
        except Article.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        article_data = article_serializer.data
        user_profile = UserProfile.objects.get(user=article.user)
        user_profile_serializer = UserProfileSerializer(user_profile)
        user_profile_data = user_profile_serializer.data
        if "image" in user_profile_data and user_profile_data["image"] is not None:
            user_profile_data["image"] = request.build_absolute_uri(
                user_profile_data["image"])
        article_data["user_profile"] = user_profile_data
        return Response(article_data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_404_NOT_FOUND)