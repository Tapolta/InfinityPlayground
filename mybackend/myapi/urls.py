from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'profile', views.ProfileViewSet, basename='profile')
router.register(r'game-desc', views.GamesDescViewSet, basename='game-desc')
router.register(r'likes', views.LikesViewSet, basename='likes')
router.register(r'user-api', views.UserApiViewSet, basename='user-api')

urlpatterns = [
    path('base/', include(router.urls)),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('check-role/', views.check_is_admin, name='check-role'),
    path('token/refresh/', views.MyTokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('get-username/', views.GetUsernameView.as_view(), name='get-username'),
    path('signup/', views.signup, name='signup'),
    path("verify-otp/",views.verify_otp, name='verify-otp' ),
    path('check-profile/', views.check_profile_exist, name='check-profile'),
    path('create-profile/', views.create_profile, name='create-profile'),
    path('get-profile-data/', views.get_profile_data, name='get-profile-data'),
    path('update-profile-data/', views.update_profile_data, name='update-profile-data'),

    #game path
    # path('get-games-data/', views.get_games_data, name='get-games-data'),
    path("dashboard-games/", views.get_game_desc, name="dashboard-game"),
    path("get-current-game/", views.get_current_game, name="get-current-game"),

    # DiamondBundle site
    path('get-diamonds-bundle/', views.get_diamonds_bundle, name="get-diamonds-bundle"),
    path('add-diamond-bundle/', views.create_new_diamonds_bundle, name='create_new_diamonds_bundle'),
    path('delete-diamonds-bundle/', views.delete_diamonds_bundle, name='create_new_diamonds_bundle'),

    #SearchLogic
    path('search/',views.search , name='search'),
    path('mini-search/',views.miniSearch , name='mini-search'),

    #AdminPath
    path('get-data-transaksi/', views.get_data_transaksi, name="get-data-transaksi"),
    path('upload-game-folder/', views.upload_game, name='upload-game-folder'),
    path('get-all-games/', views.get_games_desc, name='get-all-games'),
    path('delete-game-desc/', views.delete_game_desc, name='delete-game-desc'),

    #googlePath
    path("auth/firebase-login/", views.firebase_login, name="firebase_login"),

    #forgot password
    path("forgot-password/", views.forgot_password, name='forgot-password/'),
    path('reset-password/<uidb64>/<token>/', views.reset_password, name='reset-password'),

    #content type
    path("get-content-type/", views.get_content_type, name="get-content-type")
] 