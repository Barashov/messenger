from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, JSONParser

from .models import Chat
from .serializers import ChatCreateSerializer, UserChatsSerializer, ConnectToChatSerializer
from .logic import ChatLogic, ChatTokenLogic


class ChatView(APIView):
    """
    представление для создания чата
    """
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, )

    def get(self, request):
        """
        получение списка чатов пользователя
        """
        chats = ChatLogic.get_user_chats(request.user)
        serializer = UserChatsSerializer(chats, many=True)
        return Response(status=200, data=serializer.data)

    def post(self, request):
        serializer = ChatCreateSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = request.user
            chat = serializer.save(created_by=user)
            ChatLogic.add_user_to_chat(user, chat)
            return Response(status=201, data=serializer.data)
        return Response(status=400)


class ConnectToChatView(APIView):
    parser_classes = (JSONParser, )

    def post(self, request):
        serializer = ConnectToChatSerializer(data=request.data)
        if serializer.is_valid():
            chat_id = serializer.validated_data['chat']
            token = serializer.validated_data['token']
            chat = Chat.objects.get(pk=chat_id)
            if ChatTokenLogic.add_token_to_chat(chat=chat, token=token):
                return Response(status=200)
            return Response(status=404)
        return Response(status=400)

