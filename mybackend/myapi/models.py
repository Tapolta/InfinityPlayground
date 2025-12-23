from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
from django.utils.timezone import localtime, now, timedelta
import random
import string

# Create your models here.

class PendingUser(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    otp = models.CharField(max_length=6)
    otp_expiry = models.DateTimeField()

    def generate_otp(self):
        self.otp = ''.join(random.choices(string.digits, k=6))
        self.otp_expiry = now() + timedelta(minutes=10)
        self.save()
        return self.otp

    def save(self, *args, **kwargs):
        if not self.otp_expiry:
            self.otp_expiry = now() + timedelta(minutes=10)
        super().save(*args, **kwargs)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    username = models.TextField(max_length=24, blank=False, null=False)
    bio = models.TextField(max_length=30, default="")
    profile_id = models.IntegerField(blank=False, null=False, unique=True)
    avatar = models.ImageField('avatars/', blank=True, null=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    diamond = models.BigIntegerField(default=0)

    def __str__(self) -> str:
        return f'{self.user.username} Profile'

#Diamond model
class DiamondsBundle(models.Model):
    bundle_name = models.CharField(max_length=125)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.IntegerField()

    def __str__(self):
        return  self.bundle_name
#Diamond model end

#Games Model
class IFGame(models.Model):
    def leaderboard():
        raise NotImplementedError("Subclasses must implement this method")

    class Meta:
        abstract = True

class GamesDesc(models.Model):
    game_name = models.CharField(max_length=125, unique=True)
    game_version = models.DecimalField(default=0.0, max_digits=10, decimal_places=2)
    game_description = models.TextField(null=False, blank=True, default="")
    favourite_count = models.BigIntegerField(default=0)
    account_played = models.BigIntegerField(default=0)
    game_picture = models.ImageField('game_pic/', blank=True,null=True)
    genres = models.CharField(default=0, max_length=255)
    game_folder = models.CharField(max_length=255, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, related_name='game_content_type')

    def created_date_wib(self):
        return localtime(self.created_date)

    def __str__(self):
        return self.game_name

class Likes(models.Model):
    profile_id = models.ForeignKey(Profile, on_delete=models.CASCADE)
    game_desc = models.ForeignKey(GamesDesc, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def created_date_wib(self):
        return localtime(self.created_date)
    
    class Meta:
        unique_together = ('profile_id', 'game_desc')

class Played(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    game_desc = models.ForeignKey(GamesDesc, on_delete=models.CASCADE)
    played_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('profile', 'game_desc')
# Games Model end
