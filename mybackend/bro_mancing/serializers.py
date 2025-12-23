from .models import BroMancing, BroMancingItem
from myapi.serializers import ProfileSerializer
from rest_framework import serializers

class BroMancingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BroMancingItem
        fields = ['item_type', 'quantity']

class BroMancingSerializer(serializers.ModelSerializer):
    bro_mancing_item = BroMancingItemSerializer(many=True)
    profileField = ProfileSerializer(source='profile')
    
    class Meta:
        model = BroMancing
        fields = ['profileField','top_score_and_stage', 'last_score_and_stage','coins', 'bro_mancing_item']