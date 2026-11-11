from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "pub_date")
    search_fields = ("title", "body")
    list_filter = ("pub_date",)
    prepopulated_fields = {"slug": ("title",)}
