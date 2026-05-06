"""
Django settings for velqino_backend project.
"""

from pathlib import Path
import os
from dotenv import load_dotenv
from datetime import timedelta
import dj_database_url
import sys

# Load environment variables from .env file
load_dotenv()

# ============================================================
# ENVIRONMENT DETECTION
# ============================================================
IS_PRODUCTION = 'RENDER' in os.environ
IS_DEVELOPMENT = not IS_PRODUCTION

""" print("=" * 60)
print(f"🚀 ENVIRONMENT: {'PRODUCTION (Render)' if IS_PRODUCTION else 'DEVELOPMENT (Local)'}")
print(f"📁 File path: {__file__}")
print(f"📂 Current directory: {os.getcwd()}")
print(f"🐍 Python path: {sys.path}")
print(f"🔧 DJANGO_SETTINGS_MODULE env: {os.environ.get('DJANGO_SETTINGS_MODULE', 'NOT SET')}")
print("=" * 60) """

# ============================================================
# REDIS CONFIGURATION
# ============================================================
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.environ.get('REDIS_PORT', 6379))
REDIS_DB = int(os.environ.get('REDIS_DB', 0))
REDIS_MAX_CONNECTIONS = int(os.environ.get('REDIS_MAX_CONNECTIONS', 20))

# ============================================================
# CORS CONFIGURATION
# ============================================================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "https://velqino-backend.onrender.com",
    "https://velqino-platform.vercel.app",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "https://velqino-platform.vercel.app",
    "https://velqino-backend.onrender.com",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']
CORS_ALLOW_HEADERS = [
    'accept', 'accept-encoding', 'authorization', 'content-type',
    'dnt', 'origin', 'user-agent', 'x-csrftoken', 'x-requested-with', 'x-session-id'
]

# ============================================================
# SECURITY & CSRF SETTINGS (Environment-specific)
# ============================================================
if IS_PRODUCTION:
    # Production (Render) - HTTPS
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    USE_X_FORWARDED_HOST = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_DOMAIN = None  # Let Django handle automatically
else:
    # Development (Local) - HTTP
    SECURE_PROXY_SSL_HEADER = None
    USE_X_FORWARDED_HOST = False
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_DOMAIN = None

# Common CSRF settings
CSRF_COOKIE_NAME = 'csrftoken'
CSRF_COOKIE_AGE = 31449600  # 1 year in seconds
CSRF_COOKIE_PATH = '/'
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_USE_SESSIONS = False
CSRF_FAILURE_VIEW = 'django.views.csrf.csrf_failure'
CSRF_COOKIE_REFRESH_ON_EACH_REQUEST = False
CSRF_HEADER_NAME = 'HTTP_X_CSRFTOKEN'

AUTH_USER_MODEL = 'identity.User'

# ============================================================
# SIMPLE JWT
# ============================================================
SIMPLE_JWT = {
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
}

# ============================================================
# BUILD PATHS
# ============================================================
BASE_DIR = Path(__file__).resolve().parent.parent

# ============================================================
# SECURITY SETTINGS
# ============================================================
SECRET_KEY = os.getenv('SECRET_KEY', 'i9!k6b_xqtab_)c5l3exew!z7-5*4p06lqxau!^ny9st#9_$_4')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost,velqino-backend.onrender.com').split(',')

# ============================================================
# INSTALLED APPS
# ============================================================
INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'channels',
    
    # Custom apps
    'identity',
    'catalog',
    'commerce',
    'fulfillment',
    'realtime_hub',
    'intelligence',
    'analytics_engine',
    'media_pipeline',
]

SESSION_ENGINE = 'django.contrib.sessions.backends.db'

# ============================================================
# MIDDLEWARE
# ============================================================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'velqino_backend.urls'

# ============================================================
# TEMPLATES
# ============================================================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ============================================================
# CHANNELS & ASGI
# ============================================================
ASGI_APPLICATION = 'velqino_backend.asgi.application'

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(os.getenv('REDIS_HOST', '127.0.0.1'), int(os.getenv('REDIS_PORT', 6379)))],
        },
    },
}

# ============================================================
# REST FRAMEWORK
# ============================================================
""" print("=" * 60)
print("🔐 APPLYING REST_FRAMEWORK SETTINGS")
print("=" * 60) """

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

""" print("✅ REST_FRAMEWORK configured with AllowAny")
print("=" * 60) """

WSGI_APPLICATION = 'velqino_backend.wsgi.application'

# ============================================================
# DATABASE
# ============================================================
DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=300,
            engine='django.db.backends.mysql'
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('DB_NAME', 'veltrix_db'),
            'USER': os.getenv('DB_USER', 'veltrix_user'),
            'PASSWORD': os.getenv('DB_PASSWORD', 'veltrix@123'),
            'HOST': os.getenv('DB_HOST', '127.0.0.1'),
            'PORT': os.getenv('DB_PORT', '3306'),
            'CONN_MAX_AGE': 300,
            'OPTIONS': {
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            }
        }
    }

# ============================================================
# PASSWORD VALIDATION
# ============================================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ============================================================
# INTERNATIONALIZATION
# ============================================================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ============================================================
# STATIC FILES
# ============================================================
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ============================================================
# CELERY
# ============================================================
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://127.0.0.1:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://127.0.0.1:6379/1')
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "UTC"

# ============================================================
# CACHE
# ============================================================
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"redis://{os.getenv('REDIS_HOST', '127.0.0.1')}:{os.getenv('REDIS_PORT', 6379)}/{os.getenv('REDIS_DB_CACHE', 2)}",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "IGNORE_EXCEPTIONS": True,
        }
    }
}

CACHE_TTL = int(os.getenv('CACHE_TTL', 300))

# ============================================================
# LOGGING
# ============================================================
LOG_DIR = BASE_DIR / 'logs'
LOG_DIR.mkdir(exist_ok=True)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "[{asctime}] {levelname} {name} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "file": {
            "level": os.getenv('LOG_LEVEL', 'INFO'),
            "class": "logging.FileHandler",
            "filename": str(LOG_DIR / 'velqino.log'),
            "formatter": "verbose",
        },
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["file", "console"],
            "level": os.getenv('LOG_LEVEL', 'INFO'),
            "propagate": True,
        },
        "veltrix": {
            "handlers": ["file", "console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}

# ============================================================
# MEDIA FILES
# ============================================================
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# ============================================================
# AI API KEYS
# ============================================================
""" print("GOOGLE_VISION_API_KEY:", bool(os.getenv('GOOGLE_VISION_API_KEY')))
print("REMOVE_BG_API_KEY:", bool(os.getenv('REMOVE_BG_API_KEY')))
print("REPLICATE_API_TOKEN:", bool(os.getenv('REPLICATE_API_TOKEN')))
print("HUGGINGFACE_API_TOKEN:", bool(os.getenv('HUGGINGFACE_API_TOKEN'))) """

GOOGLE_VISION_API_KEY = os.environ.get('GOOGLE_VISION_API_KEY', '')
REMOVE_BG_API_KEY = os.environ.get('REMOVE_BG_API_KEY', '')
REPLICATE_API_TOKEN = os.environ.get('REPLICATE_API_TOKEN', '')
HUGGINGFACE_API_TOKEN = os.environ.get('HUGGINGFACE_API_TOKEN')