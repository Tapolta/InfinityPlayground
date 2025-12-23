from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import BroMancingSerializer
from .models import BroMancing, BroMancingItem

# Create your views here.

def create_new_BroMancing(request):
    bro_mancing = BroMancing.objects.create(
            profile=request.user.profile,
            top_score_and_stage="0:0", 
            last_score_and_stage="0:0",
            coins=0 
        )
    
    BroMancingItem.objects.create(
            bro_mancing=bro_mancing,
            item_type="Bom", 
            quantity=0 
        )
        
    serializer = BroMancingSerializer(bro_mancing)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated]) 
def bro_mancing_get_user_data(request):
    try:
        profile = BroMancing.objects.get(profile=request.user.profile)
        serializer = BroMancingSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except BroMancing.DoesNotExist:
       return create_new_BroMancing(request)
    
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated]) 
def update_score_and_stage(request):
    try:
        bro_mancing = BroMancing.objects.get(profile=request.user.profile)
        top_score_and_stage = request.data.get('top_score_and_stage')
        last_score_and_stage = request.data.get('last_score_and_stage')
        if top_score_and_stage and last_score_and_stage:
            bro_mancing.top_score_and_stage = top_score_and_stage
            bro_mancing.last_score_and_stage = last_score_and_stage
            bro_mancing.save()
            print(last_score_and_stage)
            return Response({"message": "Score and stage updated successfully."}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
    except BroMancing.DoesNotExist:
        return create_new_BroMancing(request)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated]) 
def update_coins(request):
    try:
        bro_mancing = BroMancing.objects.get(profile=request.user.profile)
        coins = request.data.get('coins')
        if isinstance(coins, int):
            bro_mancing.coins = coins
            bro_mancing.save()
            return Response({"message": "Coins updated successfully."}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
    except BroMancing.DoesNotExist:
        return create_new_BroMancing(request)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated]) 
def add_update_item(request):
    try:
        bro_mancing = BroMancing.objects.get(profile=request.user.profile)
        item_type = request.data.get('item_type')
        quantity = request.data.get('quantity')
        if item_type and isinstance(quantity, int):
            item, created = BroMancingItem.objects.get_or_create(
                bro_mancing=bro_mancing,
                item_type=item_type
            )
            item.quantity = quantity
            item.save()
            return Response({"message": "Item added/updated successfully."}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
    except BroMancing.DoesNotExist:
        return create_new_BroMancing(request)
    
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.AllowAny])
def get_top_ten_leaderboard(request):
    bro_mancing_data = BroMancing.objects.all()

    leaderboard = []

    for data in bro_mancing_data:
        try:
            top_score, top_stage = map(int, data.top_score_and_stage.split(":"))
        except ValueError:
            top_score, top_stage = 0, 0

        leaderboard.append({
            "id": data.profile.profile_id,
            "username": data.profile.username,
            "avatar": data.profile.avatar.url,
            "top_score": top_score,
            "top_stage": top_stage,
        })

    sorted_leaderboard = sorted(leaderboard, key=lambda x: (x['top_score'], x['top_stage']), reverse=True)

    top_ten_leaderboard = sorted_leaderboard[:10]

    result = {"leaderboards": top_ten_leaderboard}

    return Response(result, status=status.HTTP_200_OK)