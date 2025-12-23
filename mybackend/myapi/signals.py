from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Likes, Played, GamesDesc

@receiver(post_save, sender=Likes)
def update_favourite_count_on_like(sender, instance, **kwargs):
    instance.game_desc.favourite_count = Likes.objects.filter(game_desc=instance.game_desc).count()
    instance.game_desc.save()

@receiver(post_delete, sender=Likes)
def update_favourite_count_on_unlike(sender, instance, **kwargs):
    instance.game_desc.favourite_count = Likes.objects.filter(game_desc=instance.game_desc).count()
    instance.game_desc.save()

@receiver(post_save, sender=Played)
def update_account_played_on_play(sender, instance, **kwargs):
    instance.game_desc.account_played = Played.objects.filter(game_desc=instance.game_desc).count()
    instance.game_desc.save()