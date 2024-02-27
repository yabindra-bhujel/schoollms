# consumers.py
from channels.generic.websocket import WebsocketConsumer
userlist = []
class WebSocketConnection(WebsocketConsumer):
    def connect(self):
        user_id = self.scope['url_route']['kwargs']['user_id']
        socket_id = self.scope['url_route']['kwargs']['socket_id']

        existing_user = next((user for user in userlist if user['user_id'] == user_id), None)
        if existing_user:
            existing_user['socket_id'] = socket_id
        else:
            user_data = {'user_id': user_id, 'socket_id': socket_id}
            userlist.append(user_data)

        self.accept()


    def disconnect(self, close_code):
        user_id = self.scope['url_route']['kwargs']['user_id']
        userlist[:] = [user for user in userlist if user.get('user_id') != user_id]


    def getOnlineUsers(self):
        return userlist