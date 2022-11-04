from django.urls import path
from .views import *

urlpatterns = [
    path('chats/', ChatView.as_view()),
]
