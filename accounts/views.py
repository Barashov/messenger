import json
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer, ProfileSerializer
from .logics import UserLogic
from .models import User


class UserCreateView(APIView):
    """
    представление для создания пользователя
    """
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['username']
            if not UserLogic.is_user_exist(user):
                serializer.save()
                return Response(status=201, data=serializer.data)
            return Response(status=409)
        return Response(status=400, exception=serializer.errors)


class CheckUsernameExists(APIView):
    """
    проверяет существует ли такое имя пользователя в базе данных
    """
    def get(self, request, username):
        is_username_taken = UserLogic.is_user_exist(username)
        return Response(status=200, data={'is_username_taken': is_username_taken})


class UserProfileView(APIView):
    def get(self, request):
        user = ProfileSerializer(request.user)
        return Response(user.data)
