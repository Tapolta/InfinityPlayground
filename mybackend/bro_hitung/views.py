from .models import BroHitung
from .serializers import BroHitungSerializer
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import permissions
from django.conf import settings
from django.db.models import F

# Create your views here.

class BroHitungViewSet(ModelViewSet):
    queryset = BroHitung.objects.all()
    serializer_class = BroHitungSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        if len(serializer.data) == 1:
            print(serializer.data)
            return Response({"bro_hitung_data": serializer.data}, status=status.HTTP_200_OK)

        try:
            profile = getattr(request.user, 'profile', None)
            if profile is None:
                return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)
            
            if hasattr(profile, 'bro_hitung_profile') or hasattr(profile, 'bro_hitung_games'):
                return Response(
                    {"message": "Profile already has bro_hitung attribute"},
                    status=status.HTTP_200_OK
                )
            
            bro_hitung = BroHitung.objects.create(profile=profile)
            bro_hitung_serializer = BroHitungSerializer(bro_hitung)
            return Response({"bro_hitung_data": [bro_hitung_serializer.data]},  status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_create(self, serializer):
        serializer.save(profile=self.request.user.profile)

    def get_queryset(self):
        return BroHitung.objects.filter(profile=self.request.user.profile)

    @action(detail=False, methods=['GET'], url_path='get-stage-plus')
    def get_stage_plus(self, request):
        data = (
            BroHitung.objects.all()
            .order_by('-stage_plus')[:100]
            .annotate(avatar_url=F('profile__avatar'))
            .values('profile__profile_id', 'profile__username', 'avatar_url', 'stage_plus')
        )

        for item in data:
            if item['avatar_url']:
                item['avatar_url'] = request.build_absolute_uri(settings.MEDIA_URL + item['avatar_url'])

        return Response({"data_stage": data}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'], url_path='get-stage-minus')
    def get_stage_minus(self, request):
        data = (
            BroHitung.objects.all()
            .order_by('-stage_minus')[:100]
            .annotate(avatar_url=F('profile__avatar'))
            .values('profile__profile_id', 'profile__username', 'avatar_url', 'stage_minus')
        )

        for item in data:
            if item['avatar_url']:
                item['avatar_url'] = request.build_absolute_uri(settings.MEDIA_URL + item['avatar_url'])

        return Response({"data_stage": data}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'], url_path='get-stage-divide')
    def get_stage_divide(self, request):
        data = (
            BroHitung.objects.all()
            .order_by('-stage_divide')[:100]
            .annotate(avatar_url=F('profile__avatar'))
            .values('profile__profile_id', 'profile__username', 'avatar_url', 'stage_divide')
        )

        for item in data:
            if item['avatar_url']:
                item['avatar_url'] = request.build_absolute_uri(settings.MEDIA_URL + item['avatar_url'])

        return Response({"data_stage": data}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'], url_path='get-stage-multiply')
    def get_stage_multiply(self, request):
        data = (
            BroHitung.objects.all()
            .order_by('-stage_multiply')[:100]
            .annotate(avatar_url=F('profile__avatar'))
            .values('profile__profile_id', 'profile__username', 'avatar_url', 'stage_multiply')
        )

        for item in data:
            if item['avatar_url']:
                item['avatar_url'] = request.build_absolute_uri(settings.MEDIA_URL + item['avatar_url'])

        return Response({"data_stage": data}, status=status.HTTP_200_OK)
