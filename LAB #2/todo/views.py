from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics, status, viewsets, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import AllowAny
from .forms import CustomUserCreationForm, TaskForm
from .models import Task
from .serializers import UserRegisterSerializer, UserLoginSerializer, TaskSerializer
from rest_framework.generics import RetrieveAPIView

@extend_schema(tags=["Реєстрація"], request=UserRegisterSerializer, responses={201: UserRegisterSerializer})
class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User successfully registered",
                "user": UserRegisterSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=["Аутентифікація"], request=UserLoginSerializer, responses={200: 'token'})
class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(request, username=request.data.get('email'), password=request.data.get('password'))

        if not user:
            return Response({"error": "Неправильна пошта або пароль"}, status=status.HTTP_401_UNAUTHORIZED)

        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})

@extend_schema(tags=["Реєстрація"])
def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return JsonResponse({'message': 'Користувач зареєстрований'})
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})

@extend_schema(tags=["Аутентифікація"])
def user_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Вхід успішний'})
        else:
            return JsonResponse({'error': 'Невірний email або пароль'}, status=400)
    return render(request, 'login.html')

@extend_schema(tags=["Профіль кристувача"])
@login_required
def profile(request):
    user = request.user
    return JsonResponse({
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'sex': user.sex,
        'date_of_birth': user.date_of_birth.isoformat() if user.date_of_birth else None,
    })

@extend_schema(tags=["Про додаток"])
def about(request):
    data = {
        'app_name': 'To-Do List',
        'description': 'Цей додаток дозволяє керувати списком справ',
    }
    return JsonResponse(data)

@extend_schema(tags=["To-Do List"])
@login_required
def task_list(request):
    tasks = Task.objects.filter(user=request.user).values('id', 'title', 'description', 'created_at', 'due_date')
    return JsonResponse(list(tasks), safe=False)


@extend_schema(tags=["To-Do List"])
@login_required
def task_create(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user
            task.save()
            return JsonResponse({'message': 'Завдання створено', 'task_id': task.id})
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    return JsonResponse({'error': 'Метод не підтримується'}, status=405)

@extend_schema(tags=["To-Do List"])
@login_required
def task_edit(request, task_id):
    try:
        task = Task.objects.get(id=task_id, user=request.user)
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Завдання не знайдено'}, status=404)

    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            return JsonResponse({'message': 'Завдання оновлено'})
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    return JsonResponse({'error': 'Метод не підтримується'}, status=405)

@extend_schema(tags=["To-Do List"])
@login_required
def task_delete(request, task_id):
    try:
        task = Task.objects.get(id=task_id, user=request.user)
        task.delete()
        return JsonResponse({'message': 'Завдання видалено'})
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Завдання не знайдено'}, status=404)

@extend_schema(tags=["To-Do List"])
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Task.objects.all()

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@extend_schema(tags=["To-Do List"])
class TaskListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@extend_schema(tags=["To-Do List"])
class TaskDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            raise Http404

    def delete(self, request, pk):
        task = self.get_object(pk)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TaskDetailView(RetrieveAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer