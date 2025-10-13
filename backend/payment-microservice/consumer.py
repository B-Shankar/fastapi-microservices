# payment consumer

import time
from main import redis, Order

key = 'refund_order'
group = 'payment_group'

# ✅ Ensure stream and group exist before starting the consumer
try:
    if not redis.exists(key):
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
        # Read new messages from the stream
        results = redis.xreadgroup(group, key, {key: '>'}, None)

        if results:
            for result in results:
                obj = result[1][0][1]
                print("Processing refund event:", obj)

                order = Order.get(obj['pk'])
                order.status = 'refunded'
                order.save()

                print(f"Order {order.pk} refunded successfully!")

    except Exception as e:
        print("Error:", e)

    time.sleep(1)
