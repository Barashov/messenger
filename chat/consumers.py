from channels.generic.websocket import JsonWebsocketConsumer

from asgiref.sync import async_to_sync

from .logic import ChatTokenLogic, MessageLogic
from .models import Chat

from rest_framework.authtoken.models import Token


class ChatConsumer(JsonWebsocketConsumer):
    chat_id = None

    def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.accept()
        async_to_sync(self.channel_layer.group_add)(
            self.chat_id,
            self.channel_name,
        )

    def receive_json(self, content, **kwargs):
        token = content['token']
        message = content['message']
        if not token or not message:
            self.close()
        is_token_in_chat = ChatTokenLogic.is_token_in_chat(self.chat_id, token)
        if is_token_in_chat:
            chat = Chat.objects.get(pk=self.chat_id)
            user = Token.objects.get(key=token).user
            message = MessageLogic.create_message(chat=chat,
                                                  user=user,
                                                  text=message)
            async_to_sync(self.channel_layer.group_send)(
                self.chat_id,
                {
                    'type': 'chat_message',
                    'message': message.text,
                }
            )
        else:
            self.send_json({'status': 3000})
            self.close()

    def chat_message(self, content):
        self.send_json(content)


