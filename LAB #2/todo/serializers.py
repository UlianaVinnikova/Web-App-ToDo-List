from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.authtoken.models import Token
from .models import CustomUser

class UserRegisterSerializer(serializers.ModelSerializer):
    SEX = (
        ('M', 'Чоловіча'),
        ('F', 'Жіноча'),
        ('A', 'Інша')
    )

    id = serializers.ReadOnlyField()
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    sex = serializers.ChoiceField(choices=SEX)
    date_of_birth = serializers.DateField()

    class Meta:
        model = CustomUser
        fields = ["id", "first_name", "last_name", "email", "password", "sex", "date_of_birth"]
        extra_kwargs = {'password': {"write_only": True}}

    def validate_email(self, email):
        if CustomUser.objects.filter(email=email).exists():
            raise ValidationError({"detail": "Користувач із таким email вже існує."})
        return email

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        Token.objects.create(user=user)
        return user

class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'password']

from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'created_at', 'due_date', 'completed']
