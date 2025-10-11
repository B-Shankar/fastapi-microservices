# Install FastAPI with all standard dependencies
pip install "fastapi[standard]"

# Save dependencies
pip freeze > requirements.txt

# Run the FastAPI app with Uvicorn
uvicorn main:app --reload

uvicorn main:app --reload --port=8001

python consumer.py

# Run from project root
fastapi dev main.py

# Install Redis OM
pip install redis-om

# Create database on
redis.com

# Install Requests (call inventory service, from payment service) (only for Payment Service)
pip install requests