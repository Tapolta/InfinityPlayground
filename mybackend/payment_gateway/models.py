from django.db import models
from myapi.models import Profile

# Create your models here.
class Transaksi(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='transactions',null=True,  blank=True)
    order_id = models.CharField(max_length=100, unique=True)
    product_name = models.CharField(max_length=255)
    gross_amount = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=0)
    real_quantity = models.IntegerField(default=0)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    product_details = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    transaction_status = models.CharField(max_length=20, null=True, blank=True)
    transaction_time = models.DateTimeField(null=True, blank=True)
    payment_type = models.CharField(max_length=20, null=True, blank=True)
    fraud_status = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return self.customer_name