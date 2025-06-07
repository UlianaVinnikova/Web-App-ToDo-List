from rest_framework import viewsets
from .serializers import OnlineUsersSerializer
from todo.models import CustomUser
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import render


class OnlineUsersViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = OnlineUsersSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.queryset.filter(is_online=True)
        raise PermissionDenied("Access denied")

def room_view(request, room_name):
    return render(request, 'chat/room.html', {'room_name': room_name})