from .models import Chat
from accounts.models import User


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
