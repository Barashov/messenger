from django.urls import path
from .views import *

urlpatterns = [
    path('chat/', ChatCreateView.as_view()),
]
