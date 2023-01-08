from django.urls import path
from .views import *

urlpatterns = [
    path('chats/', ChatView.as_view()),
    path('connect-to-chat/', ConnectToChatView.as_view()),

]
