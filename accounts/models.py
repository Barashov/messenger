from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    username = models.CharField(verbose_name='username',
                                max_length=20,
                                db_index=True,
                                unique=True,)
    phone_number = models.IntegerField(verbose_name='номер телефона',
                                       null=True,
                                       blank=True)
    friends = models.ManyToManyField('self')
    is_phone_number_hidden = models.BooleanField(verbose_name='номер спрятан?',
                                                 default=False)
    photo = models.FileField(upload_to='users_photos/',
                             default='users_photos/avatar.jpg')

    def __str__(self):
        return self.username
