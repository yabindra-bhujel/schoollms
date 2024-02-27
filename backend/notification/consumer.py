from utils import WebSocketConnection
import json


class NotificationConsumer(WebSocketConnection):

    def sendNotification(self, event):
        userList = self.getOnlineUsers()
        recipient_user_id = event['recipient_user_id']
        notification_data = event['notification_data']
        recipient = self.__getRecipientUser(userList, recipient_user_id)
        if recipient:
            self.send(json.dumps({
                'type': 'notification',
                'notification_data': notification_data
            }))

    def __getRecipientUser(self, userList, recipient_user_id) -> list:
            return next((user for user in userList if user['user_id'] == recipient_user_id), None)


