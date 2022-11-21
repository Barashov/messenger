from django.urls import path

from .views import *

urlpatterns = [
    path('user/', UserCreateView.as_view()),
    path('username-taken/<username>/', CheckUsernameExists.as_view()),
    path('profile/', UserProfileView.as_view()),
    path('login/', LoginView.as_view()),
    path('request-add-email/', RequestToAddEmailView.as_view()),
    path('add-email/', AddEmailView.as_view())
]
