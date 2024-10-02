import json
import time
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, join_room, leave_room, rooms
import requests
import threading
import logging
from logging.handlers import RotatingFileHandler


userlist = []

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


messages_to_send = []  # List to store messages to send to Django
lock = threading.Lock()  # Thread lock for safe access to messages_to_send



# Set the desired logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
app.logger.setLevel(logging.INFO)

# Configure a rotating file handler to prevent log files from becoming too large
handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=1)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

app.logger.addHandler(handler)


@socketio.on_error_default  
def default_error_handler(e):
    app.logger.error('An error occurred:', exc_info=e)

@socketio.on('connect')
def connect():
    socket_id = request.sid
    app.logger.info('Client connected with Socket ID: %s', socket_id)
    emit_all_users()


# *****************************************
    # handle user connection and group connection
# *****************************************


@socketio.on('addNewuser')
def handle_new_user(data):
    user_id = data.get('userId')
    socket_id = request.sid

    # if username is already in userlist then only update socket id
    existing_user = next((user for user in userlist if user['userId'] == user_id), None)
    if existing_user:
        existing_user['socketId'] = socket_id
    else:
        user_data = {'userId': user_id, 'socketId': socket_id}
        userlist.append(user_data)

    emit_all_users()

@socketio.on('join-group')
def on_join_group(data):
    socket_id = request.sid
    user_id = data.get('userId')
    group_name_data = data.get('groupName')

    try:
        join_room(group_name_data, sid=socket_id)

    except Exception as e:
        app.logger.error('Error handling send message: %s', str(e))


@socketio.on('leave-group')
def on_leave_group(data):
    user_id = data.get('userId')
    group_name_data = data.get('groupName')

    # Processing the group name data
    for group_name in group_name_data:
        leave_room(group_name)
        

def emit_all_users():

    try:
        socketio.emit('all-user', userlist)
    except Exception as e:
         app.logger.error('Error emitting all users: %s', str(e))


# *****************************************
    # handle message and group message
# *****************************************
         

@socketio.on('send-message')
def handle_send_message(data):
    sender = data.get('sender_userId')
    receiver = data.get('receiver_userId')
    message = data.get('message')
    image = data.get('image')

    # Find the recipient's socket ID from the user list
    target_user = next((user for user in userlist if user['userId'] == receiver), None)

    if target_user:
            # Emit the message to the recipient's socket ID
            socketio.emit('receive-message', {
                'receiver_userId': receiver,
                'sender_userId': sender,
                'message': message,
                'image': image
            }, room=target_user['socketId'])


    with lock:
        messages_to_send.append({
            'sender': sender,
            'receiver': receiver,
            'message': message,
            'image': image
            
        }) 


group_message_data = []

@socketio.on('send-group-message')
def handle_send_group_message(data):
    receiver_group = data['receiver_group']
    sender = data['sender_userId']
    message = data['message']
    timestamp = data['timestamp']
    receriver_groupID = data['receriver_groupID']


    # Emit the message to the recipient's socket ID
    try:
        socketio.emit('receive-group-message', {
            'receiver_group': receiver_group,
            'sender_userId': sender,
            'message': message,
            'timestamp': timestamp,
        }, room=receiver_group)


    except Exception as e:
        app.logger.error('Error handling send message: %s', str(e))

    with lock:
        group_message_data.append({
            'group_id': receriver_groupID,
            'group_name': receiver_group,
            'message': message,
            'sender': sender,
        })


#*****************************************
    # handle disconnect
#*****************************************
         

@socketio.on('disconnect')
def disconnect():
    socket_id = request.sid
    # remove disconnected user from userlist
    user = next((user for user in userlist if user.get('socket_id') == socket_id), None)

    if user:
        userlist.remove(user)
    # After updating userlist, emit it to all clients
    emit_all_users()
    app.logger.info('Client disconnected with Socket ID: %s', socket_id)
    

# *****************************************
    # handle save message
# *****************************************
    
def save_messages_periodically(url):
    def periodic_task():
        while True:
            time.sleep(5) 
            with lock:
                if messages_to_send:
                    send_to_django(messages=messages_to_send.copy(), url=url)
                    messages_to_send.clear()  
    return periodic_task


def save_messages_periodically_group(url):
    while True:
        time.sleep(5)  # wait for 5 seconds
        with lock:
            if group_message_data:
                send_to_django(messages=group_message_data.copy(), url=url)  # send a copy of the messages
                group_message_data.clear()  # clear the list after sending


def send_to_django(messages, url ):
    headers = {'content-type': 'application/json'}
    for message in messages:
        response = requests.post(url, data=json.dumps(message), headers=headers)
        if response.status_code == 201:
            pass
            # app.logger.info('Message saved successfully: %s', str(message))
        else:
            pass
            # app.logger.error('Error saving message: %s', str(response.content))

# *****************************************
 # receive notification from django and send to client
# *****************************************

@app.route('/notification', methods=['POST'])
def receive_notification():
    try:
        data = request.get_json()

        user_notifications = data.get('users_notifications', [])
        title = data.get('title')
        content = data.get('content')
        timestamp = data.get('timestamp')

        for user_notification in user_notifications:
            username = user_notification.get('username')
            notification_id = user_notification.get('notification_id')
            is_read = user_notification.get('is_read')

            # Find the target user in your user list
            target_user = next((user for user in userlist if user['userId'] == username), None)
            if target_user:
                formatted_notification = {
                    "notification": {
                        "title": title,
                        "content": content,
                        "timestamp": timestamp
                    },
                    "is_read": is_read
                }

                try:
                    # Emitting the structured notification
                    socketio.emit('receive-notification', formatted_notification, room=target_user['socketId'])
                except Exception as e:
                    app.logger.error('Error in notification to %s: %s', username, str(e))

        return jsonify({'status': 'success'}), 200
    except Exception as e:
        app.logger.error('Error in receive_notification: %s', str(e))
        return jsonify({'status': 'error', 'message': str(e)}), 500


# *****************************************
    # run server
# *****************************************

if __name__ == '__main__':
    thread = threading.Thread(target=save_messages_periodically('http://127.0.0.1:8000/api/socials/save_message/'))
    thread_group = threading.Thread(target=save_messages_periodically_group, args=('http://127.0.0.1:8000/api/groups/save_group_message/',))
    thread.daemon = True  
    thread_group.daemon = True

    thread.start()
    thread_group.start()

    port = 3001
    print(f"Server running on http://0.0.0.0:{port}")
    socketio.run(app, host='0.0.0.0', port=port, debug=True)
