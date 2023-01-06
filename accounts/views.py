from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework.views import APIView

import secrets

from .serializers import *
from .logics import UserLogic, EmailLogic
from .tasks import send_token


class UserCreateView(APIView):
    """
    представление для создания пользователя
    """
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            username = serializer.validated_data['username']
            if not UserLogic.is_user_exist(username):
                serializer.save()
                password = serializer.validated_data['password']
                user = authenticate(username=username, password=password)
                if user is not None:
                    login(request, user)
                    return Response(status=201, data=ProfileSerializer(user).data)
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


class LoginView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return Response(status=200)
            return Response(status=409)
        return Response(status=400)


class RequestToAddEmailView(APIView):
    def post(self, request):
        serializer = EmailAddSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            email = serializer.validated_data['email']
            random_token = secrets.token_hex(8)
            EmailLogic.add_email_token_to_user(user_id=user.id,
                                               email=email,
                                               token=random_token)
            send_token.delay(email, random_token)
            return Response(200)
        return Response(400)


class AddEmailView(APIView):
    def post(self, request):
        serializer = TokenSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            token = serializer.validated_data['token']
            is_token_validate = EmailLogic.is_token_validate(user.pk, token)
            if is_token_validate:
                EmailLogic.add_email_to_user(user=user)
                return Response(200)
            return Response(403)
        return Response(400)