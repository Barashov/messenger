from rest_framework import serializers

from .models import Chat


class ChatCreateSerializer(serializers.Serializer):
    """
    serializer for create chat
    """
    name = serializers.CharField(max_length=15)
    photo = serializers.ImageField(required=False)
    description = serializers.CharField(required=False,
                                        allow_null=True,
                                        allow_blank=True)

    def create(self, validated_data):

        chat = Chat.objects.create(**validated_data)
        return chat

    class Meta:
        model = Chat
        fields = ('name', 'photo', 'description')


class UserChatsSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    photo = serializers.ImageField()
    description = serializers.CharField()

    class Meta:
        model = Chat
        fields = ('id', 'name', 'photo', 'description')
