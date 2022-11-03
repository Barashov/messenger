from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .serializers import ChatCreateSerializer


class ChatCreateView(APIView):
    """
    представление для создания чата
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChatCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(status=201, data=serializer.data)
        return Response(status=400)
