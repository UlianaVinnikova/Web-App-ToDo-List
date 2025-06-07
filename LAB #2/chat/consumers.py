import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message
from todo.models import CustomUser

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        if self.user.is_authenticated:
            await self.channel_layer.group_add("online_users", self.channel_name)
            await self.update_user_status(self.user, True)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        if self.user.is_authenticated:
            await self.channel_layer.group_discard("online_users", self.channel_name)
            await self.update_user_status(self.user, False)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        username = self.user.username if self.user.is_authenticated else "Анонім"
        await self.save_message(message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'username': event['username']
        }))

    @sync_to_async
    def save_message(self, content):
        if self.user.is_authenticated:
            Message.objects.create(
                user=self.user,
                room=self.room_name,
                content=content
            )

    @sync_to_async
    def update_user_status(self, user, status):
        user.is_online = status
        user.save()