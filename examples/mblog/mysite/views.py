from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from .models import Post

def homepage(request):
    posts = Post.objects.all()
    context = {
        "posts": posts,
        "now": timezone.now(),
    }
    return render(
        request, "mysite/index.html", context
    )

def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug)
    context = {"post": post, "now": timezone.now()}
    return render(request, "mysite/post.html", context)
