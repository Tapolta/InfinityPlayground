from django.db import models
from myapi.models import Profile
from myapi.models import IFGame
from django.db.models.functions import Greatest
# Create your models here.

class BroHitung(IFGame):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='bro_hitung_profile')
    stage_plus = models.IntegerField(default=0)
    stage_minus = models.IntegerField(default=0)
    stage_divide = models.IntegerField(default=0)
    stage_multiply = models.IntegerField(default=0)

    def leaderboard(self):
        user_max_score = max(self.stage_plus, self.stage_minus, self.stage_divide, self.stage_multiply)

        all_scores = BroHitung.objects.annotate(
            max_stage=Greatest('stage_plus', 'stage_minus', 'stage_divide', 'stage_multiply')
        ).values('id', 'profile__user__username', 'max_stage').order_by('-max_stage')

        rank = next((index + 1 for index, obj in enumerate(all_scores) if obj['id'] == self.id), None)

        return {
            'username': self.profile.username,
            'highest_score': user_max_score,
            'rank': rank
        }

    def __str__(self):
        return self.profile.user.username