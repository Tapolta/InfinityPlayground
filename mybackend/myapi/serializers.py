from django.contrib.auth.models import User
from rest_framework import serializers
import payment_gateway.models
from .models import Profile, DiamondsBundle, GamesDesc, Likes
import payment_gateway
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.contenttypes.models import ContentType
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.contrib.contenttypes.models import ContentType

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],    
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        data['is_admin'] = self.user.is_staff
        
        return data

class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = Profile
        fields = "__all__"

    def create(self, validated_data):
        user = validated_data.get('user')
        profile = Profile.objects.create(
            user=user,
            username=validated_data.get('username'),
            bio=validated_data.get('bio'),
            avatar=validated_data.get('avatar', None),
            profile_id=user.id
        )
        return profile
    
class DiamondsBundleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiamondsBundle
        fields = "__all__"

class TransaksiSerializer(serializers.ModelSerializer):
    class Meta:
        model = payment_gateway.models.Transaksi
        fields = "__all__"

class GamesDescSerializer(serializers.ModelSerializer):
    game_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = GamesDesc
        fields = [
            'id', 
            'game_name', 
            'game_version', 
            'game_description', 
            'favourite_count', 
            'account_played', 
            'genres', 
            'game_folder', 
            'created_date', 
            'content_type', 
            'game_picture_url'
        ]

    def get_game_picture_url(self, obj):
        request = self.context.get('request') 
        if obj.game_picture and request:
            return request.build_absolute_uri(obj.game_picture.url)
        elif obj.game_picture:
            return obj.game_picture.url
        return None

class FavoriteGameSerializer(serializers.ModelSerializer):
    game_picture_url = serializers.SerializerMethodField()
    game_data = serializers.SerializerMethodField()
    content_type_id = serializers.SerializerMethodField()

    class Meta:
        model = GamesDesc
        fields = ['game_name', 'game_picture_url', 'game_data', 'content_type_id']

    def get_game_picture_url(self, obj):
        request = self.context.get('request')
        if obj.game_picture and request:
            return request.build_absolute_uri(obj.game_picture.url)
        elif obj.game_picture:
            return obj.game_picture.url
        return None

    def get_game_data(self, obj):
        profile = self.context.get('profile')
        if not profile:
            return None 

        model_class = obj.content_type.model_class()
        instance = model_class.objects.filter(profile=profile).first()

        if instance:
            instance_data = model_to_dict(instance)
            instance_data.pop('profile', None)
            instance_data.pop('id', None)
            return instance_data
        else:
            return {'error': 'User belum memainkannya'}

    def get_content_type_id(self, obj):
        return obj.content_type.id if obj.content_type else None

class LikesSerializer(serializers.ModelSerializer):
    class Meta:
        model= Likes
        fields = '__all__'

class ContentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentType
        fields = ['id', 'app_label', 'model']

class GameSearchSerializer(serializers.ModelSerializer):
    game_picture = serializers.SerializerMethodField()

    class Meta:
        model = GamesDesc
        fields = ["game_name", "game_version", "game_picture", "genres", "game_description"]

    def get_game_picture(self, obj):
        request = self.context.get('request') 
        if obj.game_picture and request:
            return request.build_absolute_uri(obj.game_picture.url)
        return None