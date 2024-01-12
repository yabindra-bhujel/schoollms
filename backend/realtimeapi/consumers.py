# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import websockets
from .models import FriendRequest
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()



class FriendRequestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        # Handle incoming WebSocket messages
        request = json.loads(text_data)


        # Process the request
        response = await self.create_friend_request(request)

        # Send a response back to the user
        await self.send(text_data=json.dumps(response))


    
    async def create_friend_request(self, message):
        try:
            sender_username = message["sender"]
            receiver_username = message["receiver"]

            sender = User.objects.get(username=sender_username)
            receiver = User.objects.get(username=receiver_username)

        except User.DoesNotExist:
            return {'response': 'Invalid JSON data error to find user'}, status.HTTP_400_BAD_REQUEST

        try:
            friend_request = FriendRequest.objects.filter(sender=sender, receiver=receiver).first()
            if friend_request:
                return {'response': 'Friend request already exists.'}, status.HTTP_400_BAD_REQUEST
            else:
                new_friend_request = FriendRequest(sender=sender, receiver=receiver, status="pending")
                new_friend_request.save()

                # Send a notification to the Node.js server
                async with websockets.connect('ws://shikoku.tuniversity.com:3001') as websocket:
                    notification_data = {
                        "type": "new_friend_request",
                        "friend_request": {
                            "sender": sender_username,
                            "receiver": receiver_username,
                        }
                    }
                    await websocket.send(json.dumps(notification_data))

                return {'response': 'Friend request sent.'}, status.HTTP_200_OK
        except Exception as e:
            print(e)
            return {'response': 'An error occurred.'}, status.HTTP_500_INTERNAL_SERVER_ERROR

    


class ConnectionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        pass
        # Disconnection logic here

    async def receive(self, text_data):
        # Handle incoming WebSocket messages
        message = json.loads(text_data)['message']

        # Broadcast the message to all connected clients
        await self.send(text_data=json.dumps({
            'message': message
        }))
