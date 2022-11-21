from celery import shared_task

from .logics import EmailLogic
from messenger.celery import app


@app.task
def send_token(email: str, token: str):
    try:
        EmailLogic.send_email(user_email=email,
                              text=token)
        return True
    except Exception as ex:
        return ex
