from django.urls import path
from . import views
app_name = "mysite"
urlpatterns = [
    path("post/<slug:slug>/", views.post_detail, name="post-detail"),
    path("", views.homepage, name="home"),
]
