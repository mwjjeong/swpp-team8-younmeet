"""
Django settings for younmeet project.

Generated by 'django-admin startproject' using Django 1.11.5.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

if os.environ.get('DJANGO_ENV') == 'prod':
    is_prod = True
else:
    is_prod = False

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
if is_prod:
    key_file = open("/etc/younmeet/key", "r")
    SECRET_KEY = key_file.read()
else:
    SECRET_KEY = 'l)j07!#2#4d24exgiv14@wx#7h_qjgae*u$f7nu6a-54l4!p$x'

DEBUG = True

ALLOWED_HOSTS = ['52.78.6.209', 'localhost', 'ec2-52-78-6-209.ap-northeast-2.compute.amazonaws.com', 'younmeet.com']

# Application definition

INSTALLED_APPS = [
    'partial_attend_info.apps.PartialAttendInfoConfig',
    'user.apps.UserConfig',
    'room.apps.RoomConfig',
    'free_time.apps.FreeTimeConfig',
    'best_time.apps.BestTimeConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware'
]

ROOT_URLCONF = 'younmeet.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'younmeet.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

if is_prod:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'OPTIONS': {
                'read_default_file': '/etc/mysql/my.cnf',
                'charset': 'utf8mb4',
            },
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }

# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME':
        'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_L10N = True

USE_TZ = False

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'
AUTH_USER_MODEL = 'user.User'

# Root for static files
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# CORS headers settings
CORS_ORIGIN_ALLOW_ALL = True
