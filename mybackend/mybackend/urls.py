from django.contrib import admin
from django.urls import path, include
from django.conf import settings 
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('myapi.urls')),
    path('bro-mancing/', include('bro_mancing.urls'),),
    path('bro-hitung/', include('bro_hitung.urls')),
    path('payment-gateway/', include('payment_gateway.urls')),
    path('password_reset/', include('django.contrib.auth.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)