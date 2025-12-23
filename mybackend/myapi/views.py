from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, authentication_classes, permission_classes, action
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
import payment_gateway.models
from .serializers import UserSerializer, ProfileSerializer, DiamondsBundleSerializer, TransaksiSerializer, GamesDescSerializer, MyTokenObtainPairSerializer, LikesSerializer, ContentTypeSerializer, FavoriteGameSerializer, GameSearchSerializer
from .models import Profile, DiamondsBundle, GamesDesc, Likes, PendingUser, IFGame
from .permission import IsAdminUser
import payment_gateway
import os
from django.conf import settings
from django.core.files.storage import default_storage
import zipfile
from django.http import JsonResponse
import shutil
from pathlib import Path
from .firebase_auth import verify_firebase_token
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
import random
from django.contrib.contenttypes.models import ContentType
from django.apps import apps
from django.db.models import Q

token_generator = PasswordResetTokenGenerator()
# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]  
    serializer_class = MyTokenObtainPairSerializer

class MyTokenRefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]

class GetUsernameView(APIView):
    permission_classes = [permissions.IsAuthenticated] 
    def get(self, request):
        user = request.user
        return Response({"username": user.username})

#view for admin
class ProfileViewSet(ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def destroy(self, request, *args, **kwargs):
        id = kwargs.get('pk') 
        try:
            profile = Profile.objects.get(id=id)
            profile.delete() 
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Profile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND) 

class GamesDescViewSet(ModelViewSet):
    queryset = GamesDesc.objects.all()
    serializer_class = GamesDescSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    @action(detail=True, methods=['PUT'], url_path='update-game', permission_classes=[permissions.AllowAny])
    def update_game(self, request, pk=None):
        try:
            game_instance = self.get_object()

            game_name = request.data.get('game_name', game_instance.game_name)
            game_version = request.data.get('game_version', game_instance.game_version)
            game_description = request.data.get('game_description', game_instance.game_description)
            genres = request.data.get('genres', game_instance.genres)
            game_picture = request.FILES.get('game_picture', game_instance.game_picture)
            files = request.FILES.getlist("files")

            if files:
                target_dir = os.path.join(settings.MEDIA_ROOT, "Games", game_name)

                if os.path.exists(target_dir):
                    shutil.rmtree(target_dir)

                os.makedirs(target_dir, exist_ok=True)

                extracted_folder_name = None

                for file in files:
                    if file.name.endswith('.zip'):
                        zip_path = os.path.join(target_dir, file.name)
                        with default_storage.open(zip_path, "wb+") as destination:
                            for chunk in file.chunks():
                                destination.write(chunk)

                        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                            zip_ref.extractall(target_dir)

                            all_names = zip_ref.namelist()
                            if all_names:
                                extracted_folder_name = os.path.commonpath(all_names)

                        os.remove(zip_path)
                    else:
                        file_path = os.path.join(target_dir, file.name)
                        with default_storage.open(file_path, "wb+") as destination:
                            for chunk in file.chunks():
                                destination.write(chunk)

                if extracted_folder_name:
                    game_folder_path = str(Path(settings.MEDIA_URL) / "Games" / game_name / extracted_folder_name).replace('\\', '/')
                else:
                    game_folder_path = str(Path(settings.MEDIA_URL) / "Games" / game_name).replace('\\', '/')

                game_instance.game_folder = game_folder_path

            game_instance.game_name = game_name
            game_instance.game_version = game_version
            game_instance.game_description = game_description
            game_instance.genres = genres
            game_instance.game_picture = game_picture if game_picture else game_instance.game_picture

            game_instance.save()

            return Response({"message": "Game successfully updated!"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.game_folder:
            game_folder_path = Path(instance.game_folder.lstrip('/'))

            if game_folder_path.exists():
                try:
                    if game_folder_path.is_dir():
                        shutil.rmtree(game_folder_path)
                except Exception as e:
                    return Response(
                        {"message": f"Failed to delete folder: {str(e)}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
        self.perform_destroy(instance)

        return Response(
            {"message": "Game successfully deleted."},
            status=status.HTTP_204_NO_CONTENT
        )

class UserApiViewSet(ModelViewSet):
    @action(detail=False, url_path="user-games-favourite", permission_classes=[permissions.IsAuthenticated], methods=['GET'])
    def user_games_favourite(self, request, *args, **kwargs):
        user = self.request.user

        if not hasattr(user, 'profile'):
            return Response({"message": "User tidak memiliki profil!"}, status=status.HTTP_404_NOT_FOUND)
        
        game_ids = Likes.objects.filter(profile_id=user.profile).values_list('game_desc', flat=True)
        games = GamesDesc.objects.filter(id__in=game_ids)

        serializer = FavoriteGameSerializer(games, many=True, context={'request': request, 'profile': user.profile})

        related_data = {}

        for child_model in IFGame.__subclasses__():
            instance = child_model.objects.filter(profile=user.profile).first()
            
            if instance:
                data = instance.leaderboard()
                related_data[child_model.__name__] = data

        response_data = {
            "favorite_games": serializer.data,
            "top_score": related_data
        }

        return Response(response_data, status=status.HTTP_200_OK)

    @action(detail=False, url_path="reset-password", permission_classes=[permissions.IsAuthenticated], methods=['POST'])
    def user_reset_password(self, request):
        user = self.request.user

        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({"detail": "Both old and new passwords are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({"detail": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def get_data_transaksi(request):
    try:
        transaksi = payment_gateway.models.Transaksi.objects.all()
        serializer = TransaksiSerializer(transaksi, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except payment_gateway.models.Transaksi.DoesNotExist:
        return Response({"message": "tidak ditemukan data transaksi"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def check_is_admin(request):
    is_admin = request.user.is_superuser
    if is_admin:
        return Response({"message": "anda adalah admin!", "role": "admin"}, status=status.HTTP_200_OK)
    else: 
        return Response({"message": "anda adalah user!", "role": "user"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def create_new_diamonds_bundle(request):
    serializer = DiamondsBundleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Diamond bundle created successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response({
        "message": "Failed to create diamond bundle",
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def delete_diamonds_bundle(request):
    bundle_id = request.query_params.get('id')

    if not bundle_id:
        return Response({
            "message": "ID is required to delete a diamond bundle."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        bundle = DiamondsBundle.objects.get(id=bundle_id)
        bundle.delete()
        return Response({
            "message": f"Diamond bundle with ID {bundle_id} has been deleted successfully."
        }, status=status.HTTP_200_OK)
    except DiamondsBundle.DoesNotExist:
        return Response({
            "message": f"Diamond bundle with ID {bundle_id} does not exist."
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def upload_game(request):
    game_name = request.data.get('game_name')
    game_version = request.data.get('game_version')
    game_description = request.data.get('game_description')
    genres = request.data.get('genres')
    game_picture = request.FILES.get('game_picture')
    content_type_id = request.data.get('content_type')

    game_model = ContentType.objects.filter(id=content_type_id).first()
    if not game_model:
        return Response({"message": "Invalid content_type ID."}, status=400)

    if GamesDesc.objects.filter(content_type=game_model).exists():
        return Response({"message": "Game with this content_type already exists."}, status=400)

    files = request.FILES.getlist("files")
    target_dir = os.path.join(settings.MEDIA_ROOT, "Games", game_name)
    os.makedirs(target_dir, exist_ok=True)

    extracted_folder_name = None
    for file in files:
        if file.name.endswith('.zip'):
            zip_path = os.path.join(target_dir, file.name)
            with default_storage.open(zip_path, "wb+") as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(target_dir)
                all_names = zip_ref.namelist()
                if all_names:
                    extracted_folder_name = os.path.commonpath(all_names)

            os.remove(zip_path)
        else:
            file_path = os.path.join(target_dir, file.name)
            with default_storage.open(file_path, "wb+") as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

    if extracted_folder_name:
        game_folder_path = str(Path(settings.MEDIA_URL) / "Games" / game_name / extracted_folder_name).replace('\\', '/')
    else:
        game_folder_path = str(Path(settings.MEDIA_URL) / "Games" / game_name).replace('\\', '/')

    try:
        game_instance = GamesDesc.objects.create(
            game_name=game_name,
            game_version=game_version,
            game_description=game_description,
            genres=genres,
            game_picture=game_picture if game_picture else None,
            game_folder=game_folder_path,
            content_type=game_model,
        )

        return Response({"message": "Game successfully uploaded and saved!"}, status=200)

    except Exception as e:
        return Response({"message": f"Error: {str(e)}"}, status=400)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def get_games_desc(request):
    games_desc= GamesDesc.objects.all()
    serializer = GamesDescSerializer(games_desc, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def delete_game_desc(request):
    game_id = request.query_params.get('id')

    if not game_id:
        return Response({
            "message": "ID is required to delete a diamond bundle."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        game = GamesDesc.objects.get(id=game_id)
        game.delete()
        return Response({
            "message": f"Diamond bundle with ID {game_id} has been deleted successfully."
        }, status=status.HTTP_200_OK)
    except GamesDesc.DoesNotExist:
        return Response({
            "message": f"Diamond bundle with ID {game_id} does not exist."
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def get_content_type(request):
    existing_game_content_types = GamesDesc.objects.values_list('content_type', flat=True)
    
    game_models = [
        model for model in apps.get_models() 
        if issubclass(model, IFGame) and not model._meta.abstract
    ]
    
    content_types = ContentType.objects.filter(
        model__in=[model._meta.model_name for model in game_models]
    )

    content_types = ContentType.objects.filter(
        model__in=[model._meta.model_name for model in game_models]
    ).exclude(id__in=existing_game_content_types)
    
    serializer = ContentTypeSerializer(content_types, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)
#view for admin end
    
@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user_data = serializer.validated_data
        if User.objects.filter(username=user_data['username']).exists() or User.objects.filter(email=user_data['email']).exists():
            return Response({"message": "Username atau email sudah terdaftar"}, status=status.HTTP_400_BAD_REQUEST)
        
        pending_user, created = PendingUser.objects.get_or_create(email=user_data['email'], defaults={
                "username": user_data['username'],
                "password":user_data['password']
            })
        
        otp = pending_user.generate_otp()

        send_mail(
            "Kode OTP Anda",
            f"Kode OTP Anda adalah {otp}. Berlaku selama 10 menit.",
            "noreply@yourdomain.com",
            [user_data['email']],
            fail_silently=False,
        )
        
        return Response({"message": "Kode OTP telah dikirim ke email"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    try:
        pending_user = PendingUser.objects.get(email=email)
    except PendingUser.DoesNotExist:
        return Response({"message": "Email tidak ditemukan"}, status=status.HTTP_400_BAD_REQUEST)

    if pending_user.otp != otp or pending_user.otp_expiry < now():
        return Response({"message": "Kode OTP salah atau kadaluarsa"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=pending_user.username,
        email=pending_user.email,
        password=pending_user.password 
    )

    while True:
        profile_id = random.randint(100000, 999999)
        if not Profile.objects.filter(profile_id=profile_id).exists():
            break

    profile = Profile.objects.create(
        user=user,
        username="Guest"+str(profile_id),
        profile_id=profile_id
    )

    pending_user.delete()

    return Response({"message": "Akun berhasil dibuat"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def check_profile_exist(request):
    user = request.user
    profile_exists = hasattr(user, 'profile')
    if (profile_exists):
        return Response({"isProfile": profile_exists}, status=status.HTTP_200_OK)
    else: return Response("Profile is not exist", status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def create_profile(request):
    user = request.user
    if not user:
        return Response({"message": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

    if not hasattr(user, 'profile'):
        data = request.data.copy() 
        data['user'] = user.id
        data['profile_id'] = user.id 

        serializer = ProfileSerializer(data=data)
        if serializer.is_valid():
            if 'avatar' in request.FILES:
                serializer.save(user=user, avatar=request.FILES['avatar'])
            else:
                serializer.save(user=user)
            return Response({"message": "Profile created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "User sudah neniliki profile"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def get_profile_data(request):
    user = request.user
    if hasattr(user, 'profile'):
        profile = user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"message": "User does not have a profile"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def update_profile_data(request):
    user = request.user
    profile_id = request.data.get('id')

    if not profile_id:
        return Response({"message": "Profile ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    profile = get_object_or_404(Profile, id=profile_id)

    if not user.is_staff and profile.user != user:
        return Response({"message": "You do not have permission to update this profile"}, status=status.HTTP_403_FORBIDDEN)

    updated_data = {key: value for key, value in request.data.items() if key in ['username', 'bio', 'avatar', 'is_public']}

    if 'avatar' in updated_data and (updated_data['avatar'] is None or updated_data['avatar'] == ''):
        updated_data.pop('avatar', None)
    
    if 'bio' in updated_data and (updated_data['bio'] is None or updated_data['bio'] == ''):
        updated_data.pop('bio', '')

    if 'is_public' in updated_data:
        updated_data['is_public'] = updated_data['is_public'] in ['true', 'True', True]

    serializer = ProfileSerializer(profile, data=updated_data, partial=True)

    print(updated_data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)

    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def check_is_profile_exist(request):
    try:
        if hasattr(request.user, 'profile') and request.user.profile:
            return Response({"message": "Profile exists."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"message": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

#Diamond views handle
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def get_diamonds_bundle(request):
    try:
        diamondBundles = DiamondsBundle.objects.all()
        serializer = DiamondsBundleSerializer(diamondBundles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except DiamondsBundle.DoesNotExist:
        return Response({"Message": "Model diamond bundle tidak ditemukan"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#Diamond views handle end

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def get_current_game(request):
    game_name = request.data.get('game_name')
    if not game_name:
        return Response({"message": "Field 'game_name' is required in the request body."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        game = GamesDesc.objects.get(game_name__iexact=game_name)
    except GamesDesc.DoesNotExist:
        return Response({"message": "Game not found with the given name."}, status=status.HTTP_404_NOT_FOUND)
    except GamesDesc.MultipleObjectsReturned:
        return Response({"message": "Multiple games found with the same name."}, status=status.HTTP_400_BAD_REQUEST)

    serializer = GamesDescSerializer(game)
    return Response(serializer.data, status=status.HTTP_200_OK)

#Likes View
class LikesViewSet(ModelViewSet):
    queryset = Likes.objects.all()
    serializer_class = LikesSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    @action(detail=False, methods=['POST'], url_path='likes-count', permission_classes=[permissions.AllowAny])
    def get_likes_count(self, request):
        profile = request.user.profile
        game_name = request.data.get("game_name")

        if not game_name:
            return Response({"error": "game_name parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        game_desc = GamesDesc.objects.get(game_name=game_name)

        likes_count = Likes.objects.filter(game_desc=game_desc).count()

        likes = Likes.objects.filter(profile_id=profile, game_desc=game_desc).first()

        i_like = False

        if likes:
            i_like = True

        return Response({"likes_count": likes_count, "i_liked": i_like}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'], url_path='likes-add', permission_classes=[permissions.IsAuthenticated])
    def add_likes(self, request):
        game_name = request.data.get("game_name")
        profile = request.user.profile

        if not game_name:
            return Response({"error": "game_name parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            game_desc = GamesDesc.objects.get(game_name=game_name)
        except GamesDesc.DoesNotExist:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)

        existing_like = Likes.objects.filter(profile_id=profile, game_desc=game_desc).first()

        if existing_like:
            existing_like.delete()
            return Response({"message": "Like removed"}, status=status.HTTP_200_OK)
        else:
            Likes.objects.create(profile_id=profile, game_desc=game_desc)
            return Response({"message": "Like added"}, status=status.HTTP_201_CREATED)
#Likes View end

#No permission view
@api_view(['GET'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def get_game_desc(request):
    game_desc = GamesDesc.objects.values('game_name', 'game_picture', 'genres', 'favourite_count', 'account_played', 'created_date')
    for game in game_desc:
        game['game_picture'] = f"{request.build_absolute_uri(settings.MEDIA_URL)}{game['game_picture']}"
    return JsonResponse(list(game_desc), safe=False)
#No permission view end

#Google sign in view
@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def firebase_login(request):
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return JsonResponse({"error": "No token provided"}, status=401)

    token = auth_header.split(" ")[1]
    firebase_data = verify_firebase_token(token)

    if not firebase_data:
        return JsonResponse({"error": "Invalid token"}, status=401)

    try:
        django_user = User.objects.get(email=firebase_data['email'])
    except User.DoesNotExist:
        django_user = User.objects.create_user(
            username=firebase_data['uid'],
            email=firebase_data['email'],
            first_name=firebase_data.get('name', ''),
        )

        while True:
            profile_id = random.randint(100000, 999999)
            if not Profile.objects.filter(profile_id=profile_id).exists():
                break

        Profile.objects.create(
            user=django_user,
            username="Guest"+str(profile_id),
            profile_id=profile_id
        )

    refresh = RefreshToken.for_user(django_user)
    access_token = str(refresh.access_token)

    return JsonResponse({
        "access": access_token,
        "refresh": str(refresh),
    })

#Google sign in view end

#Passwword handle view
@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email', '').strip()
    user = User.objects.filter(email__iexact=email).first()

    if user:
        profile = Profile.objects.filter(username=user.pk).first()

    if not user:
        return Response({"message": "Email tidak terdaftar"}, status=status.HTTP_404_NOT_FOUND)
    
    token = token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    frontend_reset_url = f"http://localhost:3000/forgot-password/{uid}/{token}"

    subject = "Reset password Anda"
    message = f"Hai {profile.username if profile else user.username},\n\nKlik link berikut untuk reset password Anda: {frontend_reset_url}\n\nJika Anda tidak meminta reset password, abaikan email ini."

    send_mail(subject, message, 'noreply@infinityplayground.com', [email])

    return Response({"message": "Email reset password telah dikirim"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def reset_password(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (User.DoesNotExist, ValueError, TypeError):
        return Response({"message": "Link tidak valid"}, status=status.HTTP_400_BAD_REQUEST)

    if not token_generator.check_token(user, token):
        return Response({"message": "Token tidak valid atau sudah kedaluwarsa"}, status=status.HTTP_400_BAD_REQUEST)

    new_password = request.data.get('password')
    if not new_password or len(new_password) < 6:
        return Response({"message": "Password minimal 6 karakter"}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password berhasil diubah"}, status=status.HTTP_200_OK)
#Passwword handle view end

#search views
@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def miniSearch(request):
    query = request.GET.get("q", "")

    if query:
        games = GamesDesc.objects.filter(Q(game_name__icontains=query))
        return Response(games.values('id','game_name'))  
    else:
        games = GamesDesc.objects.none()
        return Response({[]})  


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def search(request):
    query = request.GET.get("q", "")
    if query:
        games = GamesDesc.objects.filter(Q(game_name__icontains=query))
    else:
        games = GamesDesc.objects.none()

    serializer = GameSearchSerializer(games, many=True, context={'request': request})
    return Response(serializer.data)  
#search views end