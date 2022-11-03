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


class FriendsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    photo = serializers.FileField()

    class Meta:
        model = User
        fields = ('id', 'username', 'photo')


class ProfileSerializer(serializers.Serializer):
    username = serializers.CharField()
    photo = serializers.FileField()
    friends = FriendsSerializer(many=True, read_only=True)
    phone_number = serializers.IntegerField()

    class Meta:
        model = User
        fields = ('username', 'photo', 'friends', 'phone_number')
