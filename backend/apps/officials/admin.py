from django.contrib import admin
from .models import Referee

@admin.register(Referee)
class RefereeAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'category', 'license_number', 'phone', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['first_name', 'last_name', 'license_number']
    ordering = ['last_name', 'first_name']
