import base64
import json
from rest_framework.response import Response
from django.http.response import JsonResponse
from django.db.models import Q

from tenant.models import UserProfile
from .models import *
from .serializer import *
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from .models import Group
import json


User = get_user_model()






@api_view(['GET'])
def get_group_message_by_groupName(request, group_name):
    try:
        group = Group.objects.get(name=group_name)
        group_message = GroupMessage.objects.filter(group=group).order_by('timestamp')
        group_message_serializer = GroupMessageSerializer(group_message, many=True)

        for message in group_message_serializer.data:
            user = User.objects.get(id=message["sender"])
            sender_username = user.username
            group_name = group.name
            message["receiver_group"] = group_name
            message["sender_userId"] = sender_username

            # remove unnecessary data
            message.pop('sender')
            message.pop('group')

        return Response(group_message_serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"response": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
def save_group_message(request):
    try:
        data = request.data
        group_id = data.get('group_id')
        group_name = data.get('group_name')
        message = data.get('message')
        sender_userId = data.get('sender')



        try:
            group = Group.objects.get(id=group_id, name=group_name)
            sender = User.objects.get(username=sender_userId)
        except ObjectDoesNotExist as e:
            print(e)
            return Response({"response": "Invalid JSON data error to find group"}, status=status.HTTP_400_BAD_REQUEST)
        

        save_group_message = GroupMessage(
            sender=sender,
            group=group,
            message=message)
        save_group_message.save()

        return Response({"response": "Message saved to database."}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"response": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_group_list(request, username):
    try:
        request_user = get_object_or_404(User, username=username)
        groups = Group.objects.filter(
            Q(admin=request_user) | Q(members=request_user)
        ).distinct()

        # Serialize group data
        group_data = []
        for group in groups:
            member_count = group.members.count()

            # Query the last message for the group
            last_message = GroupMessage.objects.filter(group=group).order_by('-timestamp').first()

            # Prepare last message data
            last_message_data = None
            if last_message:
                last_message_data = {
                    "message": last_message.message,
                    "sender": last_message.sender.username,
                    "timestamp": last_message.timestamp
                }

            group_data.append({
                "id": group.id,
                "name": group.name,
                "admin": group.admin.username,
                "member_count": member_count,
                "members": [member.username for member in group.members.all()],
                "type": "group",
                "image": request.build_absolute_uri(group.group_image.url) if group.group_image else None,
                "last_message": last_message_data
            })

        return Response({"groups": group_data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"response": "Groups not found."}, status=status.HTTP_404_NOT_FOUND
        )


# TODO:Write test
@api_view(["POST"])
def create_group(request):
    try:
        data = json.loads(request.body)
        group_name = data.get("group_name")
        users = data.get("users")
        admin = data.get("admin")

        # get admin object from username
        try:
            admin = User.objects.get(username=admin)
        except ObjectDoesNotExist:
            return Response(
                {"response": "Invalid JSON data error to find user"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # get user objects from username
        user_objs = []
        try:
            for user in users:
                user = User.objects.get(username=user)
                user_objs.append(user)
        except ObjectDoesNotExist:
            return Response(
                {"response": "Invalid JSON data error to find user"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # save group to database
        new_group = Group(name=group_name, admin=admin)
        new_group.save()
        new_group.members.add(*user_objs)
        new_group.save()
        return JsonResponse({"status": "Group Created Successfully!"}, safe=False)

    except Exception as e:
        print(e)
        return Response(
            {"response": "An error occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def all_messages(request):
    try:
        # Get all messages
        messages = Message.objects.filter(is_read=False)

        # Serialize message data
        message_data = []
        for message in messages:
            message_data.append(
                {
                    "sender": message.sender.username,
                    "receiver": message.receiver.username,
                    "message": message.message,
                    "timestamp": message.timestamp,
                    "image": message.image_data

                }
            )

        return Response({"messages": message_data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"response": "Messages not found."}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["PUT"])
def update_message_status(request, sender, receriver):
    try:
        print(request.data)

        # get user objects from username
        sender_user = get_object_or_404(User, username=sender)
        receiver_user = get_object_or_404(User, username=receriver)
        # update message status
        messages = Message.objects.filter(
            sender=sender_user, receiver=receiver_user, is_read=False
        )
        for message in messages:
            message.is_read = True
            message.save()

        return Response(
            {"response": "Message status updated."}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"response": "An error occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_all_messages(request, sender, receiver):
    try:
        # Get user objects for sender and receiver
        sender_user = get_object_or_404(User, username=sender)
        receiver_user = get_object_or_404(User, username=receiver)

        # Filter messages for the specified sender and receiver
        messages = Message.objects.filter(
            Q(sender=sender_user, receiver=receiver_user)
            | Q(sender=receiver_user, receiver=sender_user)
        ).order_by("timestamp")


        # when make request to message all message make read
        for message in messages:
            message.is_read = True
            message.save()

            

        # Serialize message data
        message_data = []

        for message in messages:
            message_data.append(
                {
                    "sender": message.sender.username,
                    "receiver": message.receiver.username,
                    "message": message.message,
                    "timestamp": message.timestamp,
                    "is_read": message.is_read,
                    "image": message.image_data
                }
            )

        return Response({"messages": message_data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"response": "Messages not found."}, status=status.HTTP_404_NOT_FOUND
        )


from django.core.files.base import ContentFile

@api_view(["POST"])
def save_message_to_database(request):
    try:
        data = request.data
        sender = data.get("sender")
        receiver = data.get("receiver")
        message = data.get("message")

        sender_user = get_object_or_404(User, username=sender)
        receiver_user = get_object_or_404(User, username=receiver)

        if 'image' in request.FILES:
            try:
                image_file = request.FILES['image'].read()
                image_content_file = ContentFile(image_file)
            except Exception as e:
                print("Error reading image file:", e)
                return Response({"response": "Error reading image file."}, status=status.HTTP_400_BAD_REQUEST)

            new_message = Message(sender=sender_user, receiver=receiver_user, message=message, image_data=image_content_file)
        else:
            new_message = Message(sender=sender_user, receiver=receiver_user, message=message)

        new_message.save()
        return Response({"response": "Message saved to database."}, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response({"response": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





@api_view(["GET"])
def get_all_user(request, username):
    try:
        # get all users
        users = User.objects.all()
        # Exclude the requesting user from the list
        requesting_user = User.objects.filter(username=username).first()
        if requesting_user:
            users = users.exclude(id=requesting_user.id)

        # Serialize user data with associated profile data
        user_data = []
        for user in users:
            profile = UserProfile.objects.filter(user=user).first()
            user_data.append(
                {
                    "is_teacher": user.is_teacher,
                    "is_student": user.is_student,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    # chnage to image url as server url
                    "image": request.build_absolute_uri(profile.image.url)
                    if profile and profile.image
                    else None,
                    "cover_image": request.build_absolute_uri(profile.cover_image.url)
                    if profile and profile.cover_image
                    else None,
                }
            )

        return Response({"users": user_data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"response": "Users not found."}, status=status.HTTP_404_NOT_FOUND
        )




# TODO:write test
@api_view(["POST"])
def make_friend_request(request):
    try:
        # get username
        sender_username = request.data["sender"]
        receiver_username = request.data["receiver"]
        try:
            # find user object from user name
            sender = User.objects.get(username=sender_username)
            receiver = User.objects.get(username=receiver_username)

        except User.DoesNotExist:
            return Response(
                {"response": "Invalid JSON data error to find user"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Check if friend request already exists
            friend_request = FriendRequest.objects.filter(
                sender=sender, receiver=receiver
            ).first()
            if friend_request:
                return Response(
                    {"response": "Friend request already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                # Create a new friend request
                new_friend_request = FriendRequest(
                    sender=sender, receiver=receiver, status="pending"
                )
                new_friend_request.save()

                # user register for socket
                # Send a notification to the Node.js server
                notification_data = {
                    "type": "new_friend_request",
                    "friend_request": {
                        "sender": sender_username,
                        "receiver": receiver_username,
                    },
                }

                return Response(
                    {"response": "Friend request sent."}, status=status.HTTP_200_OK
                )
        except Exception as e:
            print(e)
            return Response(
                {"response": "An error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    except Exception as e:
        print(e)
        return Response(
            {"response": "An error occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_all_newsFeed(request):
    try:
        newsFeeds = Post.objects.all().order_by("created_at")
        serializeNewsfeed = PostSerializer(newsFeeds, many=True)

        # Create a list to store the  data
        response_data = []

        # Iterate through each post and add user data to it
        for item in serializeNewsfeed.data:
            user = User.objects.get(id=item["user"])
            userProfile = UserProfile.objects.get(user=user)
            user_data = {
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "image": request.build_absolute_uri(userProfile.image.url)
                if userProfile and userProfile.image
                else None,
            }

           


            # # Retrieve and serialize comments for the post
            comments = Comment.objects.filter(post=item["id"])

            comment_serializer = CommentSerializer(comments, many=True)

            # Iterate through each Comment and add user data to it
            for comment in comment_serializer.data:
                user = User.objects.get(id=comment["user"])
                userProfile = UserProfile.objects.get(user=user)
                user_data = {
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "image": request.build_absolute_uri(userProfile.image.url)
                    if userProfile and userProfile.image
                    else None,
                }
                comment["user"] = user_data

            # Retrieve and serialize likes for the post
            likes = Like.objects.filter(post=item["id"])
            serializeLikes = LikeSerializer(likes, many=True)

            # Iterate through each Like and add user data to it
            for like in serializeLikes.data:
                user = User.objects.get(id=like["user"])
                userProfile = UserProfile.objects.get(user=user)
                user_data = {
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "image": request.build_absolute_uri(userProfile.image.url)
                    if userProfile and userProfile.image
                    else None,
                }
                like["user"] = user_data

            item["likes"] = serializeLikes.data

            # Update the comments data with user data
            item["comments"] = comment_serializer.data

            # Count the total number of likes and comments for this post
            total_likes = likes.count()
            total_comments = comments.count()
            item["likes_count"] = total_likes
            item["comments_count"] = total_comments

            # fetching images
            images = item["images"]
            image_urls = []
            for image_id in images:
                image_store = ImageStore.objects.get(id=image_id)
                image_urls.append(request.build_absolute_uri(image_store.image.url))
            item["images"] = image_urls

            # fetching videos
            videos = item["videos"]
            video_urls = []
            for video_id in videos:
                video_store = VideoStore.objects.get(id=video_id)
                video_urls.append(request.build_absolute_uri(video_store.video.url))
            item["videos"] = video_urls

            # Add user data to the post
            item["user"] = user_data

            # Append the modified post data to the response list
            response_data.append(item)

            reversed_data = reversed(response_data)

        return Response(reversed_data, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response(
            {"response": "An error occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_Comment(request, postID):
    try:
        comments = Comment.objects.filter(post=postID).order_by("timestamp")
        comment_serializer = CommentSerializer(comments, many=True)

        for comment in comment_serializer.data:
            user = User.objects.get(id=comment["user"])
            userProfile = UserProfile.objects.get(user=user)
            user_data = {
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "image": request.build_absolute_uri(userProfile.image.url)
                if userProfile and userProfile.image
                else None,
            }
            comment["user"] = user_data

        return Response(comment_serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"response": "An error occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def add_comment(request):
    try:
        data = request.data
        comment = data["comment"]
        post_id = data["post"]
        user_id = data["user"]

        #    find post object from post id
        try:
            post = Post.objects.get(id=post_id)
            user = User.objects.get(username=user_id["username"])
        except ObjectDoesNotExist:
            return Response(
                {"response": "Invalid JSON data error to find user"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # add new comment
        try:
            new_comment = Comment(comment=comment, user=user, post=post)
            new_comment.save()
            return Response(
                {"response": "Comment added successfully."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            print(e)
            return Response(
                {"response": "An error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    except Exception as e:
        print(e)
        return Response(
            {"response": "An error occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@parser_classes([MultiPartParser])
def add_new_Post(request):
    try:
        user_id = request.data.get("username")
        caption = request.data.get("text")

        # Access the uploaded images
        images = request.FILES.getlist("images")


        print(caption)
        print(images)

        # Access user object from username
        try:
            user = User.objects.get(username=user_id)
        except ObjectDoesNotExist:
            return Response(
                {"response": "Invalid JSON data error to find user"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Add new post and link images
        try:
            new_post = Post(text=caption, user=user)
            new_post.save()

            # Create ImageStore objects and link them to the post
            for image in images:
                image_store = ImageStore(image=image)
                image_store.save()
                new_post.images.add(image_store)

            return Response(
                {"response": "Post added successfully."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            print(e)
            return Response(
                {"response": "An error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    except Exception as e:
        print(e)
        return Response(
            {"response": "An error occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )




@api_view(["DELETE"])
def delete_post(request, postid):
    try:
        post = Post.objects.get(id=postid)
        post.delete()
        return Response(
            {"response": "Post deleted successfully."},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"response": "An error occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
@api_view(["PUT"])
def update_post(request, postid):
    try:
        post = Post.objects.get(id=postid)
    except Post.DoesNotExist:
        return Response(
            {"response": "Post not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = PostSerializer(post, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"response": "Post updated successfully."},
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            {"response": "Invalid data."},
            status=status.HTTP_400_BAD_REQUEST,
        )