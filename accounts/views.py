from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer
from .logics import UserLogic



class UserCreateView(APIView):
    """
    view для создания пользователя
    """

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['username']
            if not UserLogic.is_user_exist(user):
                serializer.save()
                return Response(status=201, data=serializer.data)
            return Response(status=400)
        return Response(status=400, exception=serializer.errors)
