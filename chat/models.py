from django.db import models
from accounts.models import User


class Chat(models.Model):
    name = models.CharField(verbose_name='название чата',
                            max_length=15)
    photo = models.FileField(verbose_name='фото чата',
                             upload_to='chats_photos/',
                             default='',
                             blank=True,
                             null=True)
    description = models.TextField(verbose_name='описание',
                                   blank=True,
                                   null=True,)
    created_by = models.ForeignKey(User,
                                   on_delete=models.SET_NULL,
                                   null=True)
    users = models.ManyToManyField(User,
                                   related_name='users')

    def __str__(self):
        return self.name


class Message(models.Model):
    text = models.TextField(verbose_name='текст сообщения')
    send_time = models.DateTimeField(auto_now_add=True)
    sent_by = models.ForeignKey(User,
                                on_delete=models.SET_NULL,
                                null=True,)
    to_chat = models.ForeignKey(Chat,
                                on_delete=models.CASCADE)

