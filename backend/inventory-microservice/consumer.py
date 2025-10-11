# inventory consumer

import time
from main import redis, Product

key = 'order_completed'
group = 'inventory_group'

# ✅ Ensure the stream and group exist before reading
try:
    if not redis.exists(key):
        # Add a dummy entry so Redis knows the stream exists
        redis.xadd(key, {'message': 'stream initialized'})
    redis.xgroup_create(key, group, id='0')
    print(f"Consumer group '{group}' created for stream '{key}'")
except Exception as e:
    if "BUSYGROUP" in str(e):
        print(f"Consumer group '{group}' already exists.")
    else:
        print(f"Error creating stream/group: {e}")

# ✅ Main consumer loop
while True:
    try:
        results = redis.xreadgroup(group, key, {key: '>'}, None)

        if results:
            for result in results:
                obj = result[1][0][1]

                try:
                    product = Product.get(obj['product_id'])
                    print(f"Updating product: {product}")
                    product.quantity = product.quantity - int(obj['quantity'])
                    product.save()
                except Exception as e:
                    print(f"Product not found, refunding: {e}")
                    redis.xadd('refund_order', obj, '*')

    except Exception as e:
        print(str(e))

    time.sleep(1)
