from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView
)

def home_view(request):
    return HttpResponse("Welcome to the To-Do List API!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('todo.urls')),
    path('', home_view),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]