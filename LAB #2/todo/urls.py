from django.urls import path, include
from .views import UserRegisterView, UserLoginView, TaskListCreateView, TaskDetailView, TaskViewSet
import todo.views as views

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'todos', TaskViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('todo/', TaskListCreateView.as_view(), name='todo-list-create'),
    path('todo/<int:pk>/', TaskDetailView.as_view(), name='todo-detail'),
]
