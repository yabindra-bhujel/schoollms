import logging
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.utils import timezone
from threading import Lock

class UserConnectionConsumer(WebsocketConsumer):
    connected_users = {}
    user_lock = Lock()
    NOTIFICATION_TYPE = 'user_updated'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.logger = logging.getLogger(__name__)
        self.user_id = None

    def connect(self):
        """Handles a new Websocket connection."""
        try:
            self.user_id = self.scope['url_route']['kwargs']['user_id']
            with self.user_lock:
                if self.user_id not in UserConnectionConsumer.connected_users:
                    UserConnectionConsumer.connected_users[self.user_id] = self.channel_name
                
                self.accept()
                self.logger.info(f"User {self.user_id} connected")
                self.send_connection_notification()

        except Exception as e:
            self.logger.error(f"Error connecting user {self.user_id}: {e}")
            self.close()

    def disconnect(self, close_code):
        """Handles a WebSocket disconnect."""
        try:
            with self.user_lock:
                if self.user_id in UserConnectionConsumer.connected_users:
                    del UserConnectionConsumer.connected_users[self.user_id]
                self.logger.info(f"User {self.user_id} disconnected")
                self.send_connection_notification()

        except Exception as e:
            self.logger.error(f"Error disconnecting user {self.user_id}: {e}")
            self.close()

    def send_connection_notification(self):
        """Sends a notification about connected users."""
        try:
            connected_users = list(UserConnectionConsumer.connected_users.keys())
            payload = {
                'type': 'broadcast_connected_users',
                'notification': {
                    'type': self.NOTIFICATION_TYPE,
                    'connected_users': connected_users
                },
                'timestamp': self.get_current_timestamp()
            }

            # Send the message directly to the channel_name
            self.send(text_data=self.encode_json(payload))

        except Exception as e:
            self.logger.error(f"Error sending connection notification: {e}")

    def encode_json(self, data):
        """Encodes the data to JSON."""
        import json
        return json.dumps(data)

    def get_current_timestamp(self) -> str:
        """Returns the current timestamp in ISO format."""
        return timezone.now().isoformat()

    def get_socket_id_by_user_id(self, user_id: str) -> str:
        """Returns the socket ID of the user, if connected."""
        return UserConnectionConsumer.connected_users.get(user_id)
