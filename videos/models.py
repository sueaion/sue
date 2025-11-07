from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify


User = get_user_model()


class Video(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    slug = models.SlugField(unique=True, blank=True)
    video_file = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    is_private = models.BooleanField(default=False, help_text='로그인 사용자만 볼 수 있음')
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title) or 'video'
            self.slug = base
            # ensure uniqueness
            i = 1
            while Video.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                i += 1
                self.slug = f"{base}-{i}"
        super().save(*args, **kwargs)

