
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('frontend.urls')),
    path('chat/', include('chat.urls')),
    path('user', include('accounts.urls')),
]
