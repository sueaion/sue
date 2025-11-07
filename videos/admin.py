from django.contrib import admin
from .models import Video


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_private', 'uploaded_at')
    list_filter = ('is_private', 'uploaded_at')
    search_fields = ('title', 'description')
    prepopulated_fields = {"slug": ("title",)}

