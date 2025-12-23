from django.urls import path, include
from .views import BroHitungViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', BroHitungViewSet, basename='bro-hitung')

urlpatterns = [
    path('', include(router.urls))
]
