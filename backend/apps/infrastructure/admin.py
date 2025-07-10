from django.contrib import admin
from .models import Venue

@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'capacity', 'field_type', 'has_lighting', 'is_active']
    list_filter = ['city', 'field_type', 'has_lighting', 'has_changing_rooms', 'is_active']
    search_fields = ['name', 'address', 'city']
    ordering = ['city', 'name']
