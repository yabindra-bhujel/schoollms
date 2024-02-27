# consumers.py

from channels.generic.websocket import WebsocketConsumer
import json

class ExampleConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        event = data.get('event')
        message = data.get('data')

        if event == 'exampleEvent':
            self.handle_example_event(message)

    def handle_example_event(self, message):
        # Handle the example event
        # For demonstration, we'll just echo the message back to the client
        self.send(text_data=json.dumps({
            'event': 'exampleEventResponse',
            'data': {
                'message': f'Received message from client: {message}'
            }
        }))
