from django.urls import path
from .views import post_transactions, midtrans_webhook, get_transactions

urlpatterns = [
    path('generate-snap-token/', post_transactions, name='generate_snap_token'),
    path("webhook/midtrans/", midtrans_webhook, name="midtrans_webhook"),
    path("get-transactions/", get_transactions, name="get-transactions"),
]