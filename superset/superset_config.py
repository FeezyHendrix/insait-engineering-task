# Superset configuration file
import os
from celery.schedules import crontab

# Database configuration
SQLALCHEMY_DATABASE_URI = 'postgresql://superset:superset@postgres:5432/superset'

# Redis configuration for caching and async queries
REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = os.getenv('REDIS_PORT', 6379)

# Caching configuration
CACHE_CONFIG = {
    'CACHE_TYPE': 'RedisCache',
    'CACHE_DEFAULT_TIMEOUT': 300,
    'CACHE_KEY_PREFIX': 'superset_',
    'CACHE_REDIS_HOST': REDIS_HOST,
    'CACHE_REDIS_PORT': REDIS_PORT,
    'CACHE_REDIS_DB': 1,
}

# Async query configurationI
class CeleryConfig:
    broker_url = f'redis://{REDIS_HOST}:{REDIS_PORT}/0'
    imports = ('superset.sql_lab', )
    result_backend = f'redis://{REDIS_HOST}:{REDIS_PORT}/0'
    worker_prefetch_multiplier = 1
    task_acks_late = False
    beat_schedule = {
        'reports.scheduler': {
            'task': 'reports.scheduler',
            'schedule': crontab(minute='*', hour='*'),
        },
        'reports.prune_log': {
            'task': 'reports.prune_log',
            'schedule': crontab(minute=10, hour=0),
        },
    }

CELERY_CONFIG = CeleryConfig

# Security
SECRET_KEY = os.getenv('SUPERSET_SECRET_KEY', 'your-secret-key-here')
GUEST_TOKEN_JWT_SECRET = os.getenv('GUEST_TOKEN_JWT_SECRET', 'HJ8x9Kp2mN4vR7wA3bC6eF9hJ2kL5nM8pQ1rS4tU7xY0zB3dE6gH9jK2mP5sV8wA1cF4hI7l0oR3uX6zA9D2fG5jL8nQ1tW4yB7eI0kN3pS6vY9C2fH5kM8qT1wZ4xA7dG0iL3oR6uX9zA2eH5kN8qT1wY4zB7fI0mP3sV6yC9gJ2lO5rU8xA1dF4hK7nQ0tW3zB6eI9lR2uX5zA8cF1hJ4mP7sV0yC3fG6kN9qT2wZ5xA8dH1iL4oR7uX0zA3eF6jM9pS2vY5zB8cG1hK4nQ7tW0zA3dF6iL9oR2uX5zA8cE1hJ4mP7sV0yC3fG6kN9qT2w')
WTF_CSRF_ENABLED = False
WTF_CSRF_TIME_LIMIT = None

# Feature flags
FEATURE_FLAGS = {
    'ENABLE_TEMPLATE_PROCESSING': True,
    'DASHBOARD_NATIVE_FILTERS': True,
    'DASHBOARD_CROSS_FILTERS': True,
    'DASHBOARD_NATIVE_FILTERS_SET': True,
    'ENABLE_ADVANCED_DATA_TYPES': True,
    'EMBEDDED_SUPERSET': True
}

# CORS settings for embedding
ENABLE_CORS = True

# Get CORS origins from environment variable
CORS_ORIGINS_ENV = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173')
CORS_ORIGINS_LIST = [origin.strip() for origin in CORS_ORIGINS_ENV.split(',')]

CORS_OPTIONS = {
    'supports_credentials': True,
    'allow_headers': [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-CSRFToken',
        'X-GuestToken'
    ],
    'resources': {
        '/api/*': {'origins': CORS_ORIGINS_LIST},
        '/superset/*': {'origins': CORS_ORIGINS_LIST},
        '/static/*': {'origins': CORS_ORIGINS_LIST}
    },
    'origins': CORS_ORIGINS_LIST
}

# Embedding configuration
PUBLIC_ROLE_LIKE_GAMMA = True
EMBEDDED_SUPERSET = True

# Additional security settings for embedding
TALISMAN_ENABLED = False
HTTP_HEADERS = {}

# Dashboard embedding
GUEST_ROLE_NAME = 'Gamma'
GUEST_TOKEN_JWT_ALGO = 'HS256'
GUEST_TOKEN_HEADER_NAME = 'X-GuestToken'
GUEST_TOKEN_JWT_EXP_SECONDS = 300  # 5 minutes
GUEST_TOKEN_JWT_AUDIENCE = 'superset'