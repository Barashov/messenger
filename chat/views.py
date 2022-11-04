from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser

from .models import Chat
from .serializers import ChatCreateSerializer, UserChatsSerializer
from .logic import ChatLogic

class ChatView(APIView):
    """
    представление для создания чата
    """
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, )

    def get(self, request):
        user = request.user
        chats = Chat.objects.filter(users=user)
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
