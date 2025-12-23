import uuid
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Transaksi
from .midtrans import create_snap_token
from rest_framework_simplejwt.authentication import JWTAuthentication
from myapi.models import Profile
from django.http import JsonResponse
import json
from myapi.permission import IsAdminUser
from .serializers import TransaksiSerializer

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def post_transactions(request):
    try:
        data = request.data
        user = request.user

        product_name = data.get("product_name")
        gross_amount = data.get("gross_amount")
        quantity = data.get("quantity")
        real_quantity = data.get("real_quantity")

        product_details = [
            {
                "id": str(uuid.uuid4()),
                "quantity": quantity,
                "name": product_name,
                "price": gross_amount,
            }
        ]

        try:
            profile = Profile.objects.get(user=user)
            first_name = profile.username
            email = user.email
        except Profile.DoesNotExist:
            return Response(
                {"error": "User profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        order_id = str(uuid.uuid4())

        customer_details = {
            "first_name": first_name,
            "last_name": "",
            "email": email,
        }

        snap_token = create_snap_token(order_id, gross_amount, customer_details, product_details)
        
        print(real_quantity)

        transaksi = Transaksi.objects.create(
            profile=profile,
            order_id=order_id,
            product_name=product_name,
            gross_amount=gross_amount,
            quantity=quantity,
            real_quantity=real_quantity,
            customer_name=first_name,
            customer_email=email,
            product_details=product_details,
            transaction_status="pending", 
            payment_type=None,
            fraud_status=None,
        )

        return Response(
            {"snap_token": snap_token, "order_id": order_id},
            status=status.HTTP_200_OK
        )

    except KeyError as e:
        return Response(
            {"error": f"Missing key: {str(e)}"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def get_transactions(request):
    transaksi = Transaksi.objects.all()
    serializer = TransaksiSerializer(transaksi, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

def save_transaction(data):
    try:
        order_id = data.get("order_id")
        
        transaction = Transaksi.objects.get(order_id=order_id)

        transaction.transaction_status = data.get("transaction_status")
        transaction.transaction_time = data.get("transaction_time")
        transaction.gross_amount = data.get("gross_amount")
        transaction.payment_type = data.get("payment_type")
        transaction.fraud_status = data.get("fraud_status", None)


        if transaction.transaction_status == "settlement":
            try:
                profile = transaction.profile
                profile.diamond +=  transaction.real_quantity
                profile.save()
            except Profile.DoesNotExist:
                return None
        
        transaction.save()

        return transaction
    except Transaksi.DoesNotExist:
        return None

@api_view(['POST'])
@permission_classes([permissions.AllowAny]) 
def midtrans_webhook(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            transaction = save_transaction(data)

            if transaction:
                return JsonResponse({"status": "success"}, status=200)
            else:
                return JsonResponse({"error": "Transaction not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid method"}, status=405)
