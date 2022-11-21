from .models import User
from messenger.settings import *

import smtplib


class UserLogic:
    @classmethod
    def is_user_exist(cls, username):
        user = User.objects.filter(username=username)
        return user.exists()


class EmailLogic:
    @classmethod
    def send_email(cls, user_email: str, text: str):
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.ehlo()
        server.starttls()
        try:
            server.login(EMAIL_HOST_USER,
                         EMAIL_HOST_PASSWORD)
            server.sendmail(from_addr=EMAIL_HOST_USER,
                            to_addrs=user_email,
                            msg=text)
        except Exception as ex:
            return ex

    @classmethod
    def add_email_token_to_user(cls, user_id, email, token):
        redis.hset(f'user_email{user_id}', 'email', email)
        redis.hset(f'user_email{user_id}', 'token', token)

    @classmethod
    def is_token_validate(cls, user_id, token):
        return str(redis.hget(f'user_email{user_id}', 'token'), 'utf-8') == token

    @classmethod
    def add_email_to_user(cls, user: User):
        email = str(redis.hget(f'user_email{user.pk}', 'email'), 'utf-8')
        user.email = email
        user.save()
