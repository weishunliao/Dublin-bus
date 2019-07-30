"""
Django settings for django_project project.

Generated by 'django-admin startproject' using Django 2.2.2.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
import sys
from decouple import config

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# key is stored in the .env file
SECRET_KEY = config('SECRET_KEY')
MAP_KEY = config('GOOGLE_MAP_KEY')
# key for the Openweather API: stored in the .env file
OPENWEATHER_KEY = config('OPENWEATHER_KEY')
PUBLIC_DIR = os.path.join(BASE_DIR, '')
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'livereload',
    'webpack_loader',
    'dublin_bus',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'livereload.middleware.LiveReloadScript',
]

ROOT_URLCONF = 'django_project.urls'

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

WSGI_APPLICATION = 'django_project.wsgi.application'

# Database


DATABASES = {
    'default': {

        'NAME': 'db_route_info',  # database name
        'USER': 'team8',
        'ENGINE': 'django.db.backends.mysql',
        'PASSWORD': config('DATABASE_PASSWORD'),
        'PORT': '3306',

        #     # PRODUCTION
        # ''HOST': 'localhost','
        'HOST': '127.0.0.1',

        #     # UCD - 137.43.49.50 is for development
            # 'HOST': '137.43.49.50'
    }

}

# these setting is uni-test use
# if 'test' in sys.argv:
#     DATABASES['default'] = {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'unit_test',
#         'USER': 'root',
#         'PASSWORD': '',
#         'HOST': '127.0.0.1',
#         'PORT': '3306',
#     }
#     SECRET_KEY = "$SECRET_KEY"

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Dublin'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_ROOT = os.path.join(PUBLIC_DIR, '../static')
STATIC_URL = '/static/'
STATICFILES_DIRS = (
    # We do this so that django's collectstatic copies or our bundles to the STATIC_ROOT
    # or syncs them to whatever storage we use.
    os.path.join(BASE_DIR, 'dist'),
)

WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': not DEBUG,
        'BUNDLE_DIR_NAME': '',  # must end with slash
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
        'POLL_INTERVAL': 0.1,
        'TIMEOUT': None,
        'IGNORE': [r'.+\.hot-update.js', r'.+\.map']
    }
}

# directory where machine learning models are stored
ML_MODEL_ROOT = os.path.join(BASE_DIR, 'dublin_bus/ml_models')
