from rest_framework import serializers
from .models import User


class UserSerializer(serializers.Serializer):
    """
    serializer для создания пользователя
    """
    username = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        username = validated_data['username']
        password = validated_data['password']
        user = User.objects.create_user(username=username,
                                        password=password)
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'password')
