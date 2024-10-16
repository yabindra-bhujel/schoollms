from .models import Message, Group, GroupMessage
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

class PrivateMessageServices:
    
        def __init__(self):
            pass
    
        def save_message(self, data: dict) -> int:
            """
            Saves a private message to the database.
            
            Args:
                data (dict): The message data containing 'sender_user_Id', 
                            'receiver_user_Id', and 'message'.
            
            Returns:
                int: The ID of the saved message, or None if an error occurred.
            """
    
            try:
                # Validate input data
                required_fields = ['sender_user_id', 'receiver_user_id', 'message']
                for field in required_fields:
                    if field not in data:
                        logger.error(f"Missing field in data: {field}")
                        return None
    
                # Fetch sender and receiver users using get_object_or_404
                sender = get_object_or_404(User, username=data['sender_user_id'])
                receiver = get_object_or_404(User, username=data['receiver_user_id'])
    
                # Create and save the message
                message = Message(
                    sender=sender,
                    receiver=receiver,
                    message=data['message'],
                    timestamp=timezone.now()
                )
                message.save()
    
                logger.info(f"Message saved: {message.id} from {sender.username} to {receiver.username}")
    
                return message.id
            
            except Exception as e:
                logger.error(f"Error saving private message: {e}")
                return None

class GroupMessageServices:

    def __init__(self):
        pass

    def save_message(self, data: dict) -> int:
        """
        Saves a group message to the database.
        
        Args:
            data (dict): The message data containing 'receiver_group_Id', 
                          'user_id', and 'message'.
        
        Returns:
            int: The ID of the saved message, or None if an error occurred.
        """

        try:
            print(data)
            # Validate input data
            required_fields = ['receiver_group_Id', 'user_id', 'message']
            for field in required_fields:
                if field not in data:
                    logger.error(f"Missing field in data: {field}")
                    return None

            # Fetch group and sender user using get_object_or_404
            group = get_object_or_404(Group, id=data['receiver_group_Id'])
            sender = get_object_or_404(User, username=data['user_id'])

            # Create and save the message
            message = GroupMessage(
                group=group,
                sender=sender,
                message=data['message'],
                timestamp=timezone.now()
            )
            message.save()

            logger.info(f"Message saved: {message.id} from {sender.username} to group {group.id}")

            return message.id
        
        except Exception as e:
            logger.error(f"Error saving group message: {e}")
            return None
