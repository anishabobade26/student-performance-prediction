import time
import json
from typing import Any, Optional
from loguru import logger
from app.core.config import settings

try:
    import redis
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True, socket_timeout=2)
    redis_client.ping()
    HAS_REDIS = True
    logger.info("Connected to Redis cache.")
except Exception as e:
    redis_client = None
    HAS_REDIS = False
    logger.info("Redis not available. Using high-performance in-memory cache fallback.")


class CacheManager:
    """Provides key-value caching with TTL, supporting Redis and in-memory fallback."""
    def __init__(self):
        self._memory_cache = {}

    def get(self, key: str) -> Optional[Any]:
        if HAS_REDIS and redis_client is not None:
            try:
                val = redis_client.get(key)
                if val is not None:
                    return json.loads(val)
            except Exception as e:
                logger.warning(f"Redis get error: {e}")

        # In-memory fallback
        if key in self._memory_cache:
            item = self._memory_cache[key]
            if item["expires_at"] is None or item["expires_at"] > time.time():
                return item["value"]
            else:
                del self._memory_cache[key]
        return None

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = 300):
        if HAS_REDIS and redis_client is not None:
            try:
                val_str = json.dumps(value)
                if ttl_seconds:
                    redis_client.setex(key, ttl_seconds, val_str)
                else:
                    redis_client.set(key, val_str)
                return
            except Exception as e:
                logger.warning(f"Redis set error: {e}")

        # In-memory fallback
        expires_at = time.time() + ttl_seconds if ttl_seconds else None
        self._memory_cache[key] = {
            "value": value,
            "expires_at": expires_at
        }

    def delete(self, key: str):
        if HAS_REDIS and redis_client is not None:
            try:
                redis_client.delete(key)
            except Exception:
                pass
        self._memory_cache.pop(key, None)

    def clear(self):
        if HAS_REDIS and redis_client is not None:
            try:
                redis_client.flushdb()
            except Exception:
                pass
        self._memory_cache.clear()


cache = CacheManager()
