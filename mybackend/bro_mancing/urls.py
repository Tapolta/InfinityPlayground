from django.urls import path
from . import views

urlpatterns = [
    path('get-user-data/', views.bro_mancing_get_user_data, name='bro_mancing_get_user_data'),
    path('update-score-and-stage/', views.update_score_and_stage, name='update_score_and_stage'),
    path('update-coins/', views.update_coins, name='update_coins'),
    path('add-update-item/', views.add_update_item, name='add_update_item'),
    path('get-leaderboard/', views.get_top_ten_leaderboard, name='get-leaderboard' )
]
