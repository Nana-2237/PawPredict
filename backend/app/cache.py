# cache.py
import redis
import os

r = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

def get_cached_prediction(hash_key):
    return r.get(hash_key)

def set_cached_prediction(hash_key, prediction, expiry=3600):
    r.set(hash_key, prediction, ex=expiry)
