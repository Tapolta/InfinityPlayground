from .models import BroHitung
from rest_framework import serializers
from myapi.serializers import ProfileSerializer

class BroHitungSerializer(serializers.ModelSerializer):
    profile_serializer = ProfileSerializer(source='profile', read_only=True)
    class Meta:
        model = BroHitung
        fields  = ["profile_serializer", "stage_plus", "stage_minus", "stage_divide", "stage_multiply"]