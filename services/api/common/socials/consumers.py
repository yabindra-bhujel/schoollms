import json
import logging
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .services import GroupMessageServices, PrivateMessageServices

class GroupChatConsumer(WebsocketConsumer):

    connected_users = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.logger = logging.getLogger(__name__)
        self.group_name = None
        self.user_id = None
        self.group_message_services = GroupMessageServices()

    def connect(self):
        """
        Handles a new WebSocket connection.
        Expects 'group_name' and 'user_id' as URL route parameters.
        """
        try:
            self.group_name = self.scope['url_route']['kwargs']['group_name']
            self.user_id = self.scope['url_route']['kwargs']['user_id']

            if self.group_name not in GroupChatConsumer.connected_users:
                GroupChatConsumer.connected_users[self.group_name] = {}

            # Join room group
            async_to_sync(self.channel_layer.group_add)(
                self.group_name,
                self.channel_name
            )

            self.accept()

            GroupChatConsumer.connected_users[self.group_name][self.user_id] = self.channel_name

            self.logger.info(f"User {self.user_id} connected to group {self.group_name}")

            # Notify other users in the group about the updated connected users list
            self.send_group_notification({
                'type': 'user_updated',
                'connected_users': list(GroupChatConsumer.connected_users[self.group_name].keys())
            })

        except Exception as e:
            self.logger.error(f"Error connecting to group: {e}")
            self.close()

    def disconnect(self, close_code):
        """
        Handles a WebSocket disconnect.
        """
        try:
            if self.group_name and self.user_id in GroupChatConsumer.connected_users.get(self.group_name, {}):
                del GroupChatConsumer.connected_users[self.group_name][self.user_id]

            # Leave room group
            if self.group_name:
                async_to_sync(self.channel_layer.group_discard)(
                    self.group_name,
                    self.channel_name
                )

            # Log the disconnection
            self.logger.info(f"User {self.user_id} disconnected from group {self.group_name}")

            if self.group_name:
                self.send_group_notification({
                    'type': 'user_updated',
                    'connected_users': list(GroupChatConsumer.connected_users[self.group_name].keys())
                })
        except Exception as e:
            self.logger.error(f"Error disconnecting from group: {e}")

    def receive(self, text_data):
        """
        Handles receiving a message from the WebSocket.
        """

        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            receiver_group_name = text_data_json['receiver_group_name']
            receiver_group_id = text_data_json['receiver_group_Id']
            sender_user_id = text_data_json['sender_user_Id']

            # Send message to room group
            async_to_sync(self.channel_layer.group_send)(
               receiver_group_name,
                {
                    'type': 'group_message',
                    'message': message,
                    'timestamp': self.get_current_timestamp(),
                    'receiver_group_Id': receiver_group_id,
                    'receiver_group_name': receiver_group_name,
                    'sender_user_Id': sender_user_id
                }
            )

        except Exception as e:
            self.logger.error(f"Error receiving message: {e}")

    def send_group_notification(self, notification):
        """
        Sends a notification to the group.
        """
        try:
            payload = {
                'type': 'broadcast_connected_users',
                'notification': notification,
                'timestamp': self.get_current_timestamp()
            }

            async_to_sync(self.channel_layer.group_send)(
                self.group_name,
                payload
            )

        except Exception as e:
            self.logger.error(f"Error sending group notification: {e}")

    def broadcast_connected_users(self, event):
        """
        Handles broadcasting the connected users list to all clients.
        """
        notification = event['notification']

        # Send the notification to the WebSocket
        self.send(text_data=json.dumps(notification))

    def group_message(self, event):
      """
      Handles group messages sent to the group.
      """
      message = event.get('message')
      timestamp = event.get('timestamp')
      receiver_group_Id = event.get('receiver_group_Id')
      receiver_group_name = event.get('receiver_group_name')
      user_id = event.get('sender_user_Id')


      message_id = self.group_message_services.save_message({
         'receiver_group_Id': receiver_group_Id,
         'user_id': user_id,
         'message': message
      })


      payload = {
          'type': 'group_message',
          'id': message_id,
          'message': message,
          'sender_userId': user_id,
          'timestamp': timestamp,
          'receiver_group': receiver_group_name
      }

      # Send the message to the WebSocket
      self.send(text_data=json.dumps(payload))


    def get_current_timestamp(self)->str:
        """
        Returns the current timestamp.
        """
        from django.utils import timezone
        return timezone.now().isoformat()



class PrivateChatConsumer(WebsocketConsumer):

    connected_private_chats = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.logger = logging.getLogger(__name__)
        self.user_id = None
        self.other_user_id = None
        self.group_name = None
        self.private_message_services = PrivateMessageServices()

    def connect(self):
        """
        Handles a new WebSocket connection for private chat.
        Expects 'user_id' and 'other_user_id' as URL route parameters.
        """
        try:
            self.user_id = self.scope['url_route']['kwargs']['user_id']
            self.other_user_id = self.scope['url_route']['kwargs']['other_user_id']

            # Generate a unique group name for the two users
            self.group_name = self.get_private_group_name(self.user_id, self.other_user_id)

            # Add this channel to the private group
            async_to_sync(self.channel_layer.group_add)(
                self.group_name,
                self.channel_name
            )

            self.accept()

            # Initialize the connected users set for this group if not already
            if self.group_name not in PrivateChatConsumer.connected_private_chats:
                PrivateChatConsumer.connected_private_chats[self.group_name] = set()

            # Add the current user to the connected users set
            PrivateChatConsumer.connected_private_chats[self.group_name].add(self.user_id)

            self.logger.info(f"User {self.user_id} connected to private chat with {self.other_user_id} in group {self.group_name}")

            # Optionally, send a notification about connected users
            self.send_private_notification({
                'type': 'user_updated',
                'connected_users': list(PrivateChatConsumer.connected_private_chats[self.group_name])
            })

        except Exception as e:
            self.logger.error(f"Error connecting to private chat: {e}")
            self.close()

    def disconnect(self, close_code):
        """
        Handles WebSocket disconnection from private chat.
        """
        try:
            # Remove the user from the connected users set
            if self.group_name and self.user_id in PrivateChatConsumer.connected_private_chats.get(self.group_name, set()):
                PrivateChatConsumer.connected_private_chats[self.group_name].remove(self.user_id)
                if not PrivateChatConsumer.connected_private_chats[self.group_name]:
                    del PrivateChatConsumer.connected_private_chats[self.group_name]

            # Remove this channel from the private group
            if self.group_name:
                async_to_sync(self.channel_layer.group_discard)(
                    self.group_name,
                    self.channel_name
                )

            self.logger.info(f"User {self.user_id} disconnected from private chat group {self.group_name}")

            # Optionally, send a notification about connected users
            if self.group_name:
                self.send_private_notification({
                    'type': 'user_updated',
                    'connected_users': list(PrivateChatConsumer.connected_private_chats.get(self.group_name, []))
                })

        except Exception as e:
            self.logger.error(f"Error disconnecting from private chat: {e}")

    def receive(self, text_data):
        """
        Handles receiving a message from the WebSocket.
        """
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            sender_user_id = text_data_json['sender_user_id']
            receiver_user_id = text_data_json['receiver_user_id']

            # Save the message to the database or perform any necessary processing
            message_id = self.private_message_services.save_message({
                'sender_user_id': sender_user_id,
                'receiver_user_id': receiver_user_id,
                'message': message
            })

            # Prepare the payload to send to the group
            payload = {
                'type': 'private_message',
                'id': message_id,
                'message': message,
                'sender_user_id': sender_user_id,
                'timestamp': self.get_current_timestamp(),
                'receiver_user_id': receiver_user_id
            }

            # Send the message to the group
            async_to_sync(self.channel_layer.group_send)(
                self.group_name,
                payload
            )

        except Exception as e:
            self.logger.error(f"Error receiving message: {e}")

    def private_message(self, event):
        """
        Handles private messages sent to the group.
        """
        try:
            message = event.get('message')
            sender_user_id = event.get('sender_user_id')
            timestamp = event.get('timestamp')
            message_id = event.get('id')
            receiver_user_id = event.get('receiver_user_id')

            payload = {
                'type': 'private_message',
                'id': message_id,
                'message': message,
                'sender': sender_user_id,
                'timestamp': timestamp,
                'receiver': receiver_user_id
            }

            # Send the message to the WebSocket
            self.send(text_data=json.dumps(payload))

        except Exception as e:
            self.logger.error(f"Error sending private message: {e}")

    def send_private_notification(self, notification):
        """
        Sends a notification to the private group.
        """
        try:
            payload = {
                'type': 'broadcast_connected_users',
                'notification': notification,
                'timestamp': self.get_current_timestamp()
            }

            async_to_sync(self.channel_layer.group_send)(
                self.group_name,
                payload
            )

        except Exception as e:
            self.logger.error(f"Error sending private notification: {e}")

    def broadcast_connected_users(self, event):
        """
        Handles broadcasting the connected users list to all clients.
        """
        notification = event['notification']

        # Send the notification to the WebSocket
        self.send(text_data=json.dumps(notification))

    def get_private_group_name(self, user1_id, user2_id):
        """
        Generates a unique group name for a private chat between two users.
        Ensures consistency by sorting user IDs.
        """
        sorted_ids = sorted([str(user1_id), str(user2_id)])
        return f'private_chat_{sorted_ids[0]}_{sorted_ids[1]}'

    def get_current_timestamp(self) -> str:
        """
        Returns the current timestamp.
        """
        from django.utils import timezone
        return timezone.now().isoformat()

