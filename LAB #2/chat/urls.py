from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OnlineUsersViewSet
from .views import room_view

router = DefaultRouter()
router.register(r'online-users', OnlineUsersViewSet, basename='online-users')

urlpatterns = [
    path('', include(router.urls)),
    path('<str:room_name>/', room_view, name='chat-room'),
]
