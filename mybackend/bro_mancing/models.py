from django.db import models
from myapi.models import Profile
from myapi.models import IFGame

# Create your models here.
class BroMancing(IFGame):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='bro_mancing')
    top_score_and_stage = models.CharField(max_length=100, default="0:0")
    last_score_and_stage = models.CharField(max_length=100, default="0:0")
    average_top_score = models.IntegerField(default=0)
    coins = models.IntegerField(default=0)

    def leaderboard(self):
        try:
            score, stage = map(int, self.top_score_and_stage.split(':'))
        except ValueError:
            score, stage = 0, 0 

        all_scores = BroMancing.objects.values('id', 'profile__username', 'average_top_score')

        sorted_scores = sorted(
            all_scores,
            key=lambda x: x['average_top_score'],
            reverse=True
        )

        rank = next((index + 1 for index, obj in enumerate(sorted_scores) if obj['id'] == self.id), None)

        return {
            'username': self.profile.username,
            'score': score,
            'stage': stage,
            'rank': rank
        }

    def __str__(self):
        return f"{self.profile.username} - Coins: {self.coins} - Top Stage: {self.top_score_and_stage}, Last Stage {self.last_score_and_stage}"

class BroMancingItem(models.Model):
    bro_mancing = models.ForeignKey(BroMancing, on_delete=models.CASCADE, related_name='bro_mancing_item')
    item_type = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)

    class Meta:
        unique_together = ('bro_mancing', 'item_type')

    def __str__(self):
        return f"{self.bro_mancing.profile.username} - {self.item_type}: {self.quantity}"