import midtransclient

snap = midtransclient.Snap(
    is_production=False, 
    server_key='SB-Mid-server-NCT7Jrd-vBCamgSBLTw9mCck'
)

def create_snap_token(order_id, gross_amount, customer_details, product_details):
    transaction_details = {
        "transaction_details": {
            "order_id": order_id,
            "gross_amount": gross_amount,
        },
        "customer_details": customer_details,
        "item_details": product_details,
    }
    
    snap_token = snap.create_transaction(transaction_details)["token"]
    return snap_token