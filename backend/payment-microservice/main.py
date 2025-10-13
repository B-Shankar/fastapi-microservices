# Payment Microservice

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.background import BackgroundTasks
from redis_om import get_redis_connection, HashModel
from starlette.requests import Request
from dotenv import load_dotenv
import os, requests, time

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*']
)

# Redis connection setup: This has to different database than inventory
# But for this case, we will use the same database
redis = get_redis_connection(
    host = os.getenv("REDIS_HOST_URL"),
    port = os.getenv("REDIS_PORT"),
    password = os.getenv("REDIS_PASSWORD"),
    decode_responses = True,
)

class Order(HashModel):
    product_id: str
    price: float
    fee: float
    total: float
    quantity: int
    status: str # pending, completed, refunded

    class Meta:
        database =redis

@app.get('/', summary='Root Endpoint of Payment Microservice')
async def root():
    return {"message": "Welcome to Payment Microservice"}

@app.get('/orders', summary="Get All Orders")
def get_orders():
    return [format(pk) for pk in Order.all_pks()]

def format(pk: str):
    order = Order.get(pk)

    return {
        "pk": order.pk,
        "product_id": order.product_id,
        "price": order.price,
        "fee": order.fee,
        "total": order.total,
        "quantity": order.quantity,
        "status": order.status,
    }

@app.get('/orders/{pk}', summary="Get Order By Primary Key")
def get_order(pk: str):
    return Order.get(pk)


@app.post('/orders', summary='Create an Order')
async def create_order(request: Request, background_tasks: BackgroundTasks): # id, quantity
    body = await request.json()

    # req = requests.get('http://localhost:8000/products/%s' % body['id'])
    # product = req.json()

    req = requests.get(f"http://localhost:8000/products/{body['id']}")

    if req.status_code != 200:
        return {"error": f"Failed to fetch product: {req.status_code}", "details": req.text}

    try:
        product = req.json()
    except Exception:
        return {"error": "Invalid JSON from inventory service", "raw_response": req.text}

    order = Order(
        product_id=body['id'],
        price=product['price'],
        fee=0.2 * product['price'],
        total=1.2 * product['price'],
        quantity=body['quantity'],
        status='pending'
    )
    order.save()

    background_tasks.add_task(order_completed, order) # (function_name, args)

    return order

def order_completed(order: Order):
    time.sleep(5) # Assuming it takes 5 sec to make payment # 10 sec for refunded case
    order.status = 'completed'
    order.save()
    # Redis Stream
    redis.xadd('order_completed', order.dict(), '*')