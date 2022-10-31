from django.urls import path

from .views import UserCreateView, CheckUsernameExists

urlpatterns = [
    path('user/', UserCreateView.as_view()),
    path('username-taken/<username>/', CheckUsernameExists.as_view()),
]
