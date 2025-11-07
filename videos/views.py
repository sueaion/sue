from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from .models import Video


def index(request):
    if request.user.is_authenticated:
        qs = Video.objects.all()
    else:
        qs = Video.objects.filter(is_private=False)
    return render(request, 'videos/index.html', {'videos': qs})


def detail(request, slug):
    video = get_object_or_404(Video, slug=slug)
    if video.is_private and not request.user.is_authenticated:
        return redirect(f"{reverse('login')}?next={request.path}")
    return render(request, 'videos/detail.html', {'video': video})

