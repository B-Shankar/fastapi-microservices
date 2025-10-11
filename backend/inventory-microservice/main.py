# Inventory Microservice

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis_om import get_redis_connection, HashModel
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*']
)

# Redis connection setup
redis = get_redis_connection(
    host = os.getenv("REDIS_HOST_URL"),
    port = os.getenv("REDIS_PORT"),
    password = os.getenv("REDIS_PASSWORD"),
    decode_responses = True,
)

class Product(HashModel):
    name: str
    price: float
    quantity: int

    class Meta:
        database = redis

@app.get('/', summary='Root Endpoint of Inventory Microservice')
def root():
    return {"message": "Welcome to Inventory Microservice"}

@app.get('/products', summary='Get all products')
def get_all_products():
    return [format(pk) for pk in Product.all_pks()]


def format(pk: str):
    product = Product.get(pk)

    return {
        "id": product.pk,
        "name": product.name,
        "price": product.price,
        "quantity": product.quantity
    }

@app.post('/product', summary='Create a new product')
def create_product(product:Product):
    return product.save()

@app.get('/products/{pk}', summary="Get product by primary key")
def get_product(pk: str):
    return Product.get(pk)

@app.delete('/products/{pk}', summary='Delete product by primary key')
def delete_product(pk: str):
    return Product.delete(pk)