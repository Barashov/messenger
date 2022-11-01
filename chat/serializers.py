from rest_framework import serializers

from .models import Chat


class ChatCreateSerializer(serializers.Serializer):
    """
    serializer for create chat
    """
    name = serializers.CharField(max_length=15)
    photo = serializers.FileField(required=False)
    description = serializers.CharField()

    def create(self, validated_data):
        return Chat.objects.create(**validated_data)

    class Meta:
        model = Chat
        fields = ('name', 'photo', 'description', 'created_by', 'users')
