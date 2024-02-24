# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import websockets
from .models import FriendRequest
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()



class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
       await self.accept()
       print('Connected')
       await self.send(json.dumps({'message': 'connected'}))