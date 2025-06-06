from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Task

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'first_name', 'last_name', 'sex', 'date_of_birth', 'is_staff')
    ordering = ['email']
    search_fields = ('email', 'first_name', 'last_name')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Особисті дані', {'fields': ('first_name', 'last_name', 'sex', 'date_of_birth')}),
        ('Права доступу', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Важливі дати', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'sex', 'date_of_birth'),
        }),
    )

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'completed', 'due_date', 'created_at')
    list_filter = ('completed', 'due_date', 'user')
    search_fields = ('title', 'description', 'user__email')  # замінив username на email
