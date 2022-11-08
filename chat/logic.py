from .models import Chat, Message
from accounts.models import User
from messenger.settings import redis

from rest_framework.authtoken.models import Token


class MessageLogic:
    @classmethod
    def create_message(cls, chat: Chat, user: User, text: str):
        try:
            message = Message.objects.create(text=text,
                                             sent_by=user,
                                             to_chat=chat)
            return message
        except Exception as error:
            return error


class ChatLogic:
    @classmethod
    def add_user_to_chat(cls, user: User, chat: Chat):
        try:
            chat.users.add(user)
        except Exception as ex:
            return ex

    @classmethod
    def delete_user_from_chat(cls, user: User, chat: Chat):
        try:
            chat.users.remove(user)
        except Exception as ex:
            return ex

    @classmethod
    def is_user_creator_of_chat(cls, user: User, chat: Chat):
        """
        является ли пользователь создателем чата.
        если является, метод вернет True.
        Принимает 2 аргумента: user-пользователь и chat-чат
        """
        try:
            if chat.created_by == user:
                return True
            return False
        except Exception as ex:
            return ex


class ChatTokenLogic:
    @classmethod
    def is_token_in_chat(cls, chat_id: int, token: str):
        """
        return True if token in chat list
        else return False
        """
        result = redis.lpos(f'chat_{chat_id}', token)

        if result is not None:
            return True
        else:
            return False

    @classmethod
    def add_token_to_chat(cls, chat: Chat, token: str):
        if cls.is_token_in_chat(chat_id=chat.pk, token=token):
            return True
        user = Token.objects.get(key=token).user
        if user in chat.users.all():
            redis.lpush(f'chat_{chat.pk}', token)
            return True
        return False
