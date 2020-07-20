# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '_zo10w!04#yw*-ye&bh=g8pk0w=n20sp1lxm4mdpvdk)m3!h!-'

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'dbhrbrht580khr',
        'USER': 'ydibqwvgxgyzym',
        'PASSWORD': '754c456a7ce1d572dc5b7dabf69f5ceabf0f5a9326c912ae2440a6db7f8133ce',
        'HOST': 'ec2-34-197-141-7.compute-1.amazonaws.com',
        'PORT': '5432',
    }
}

# SECURITY WARNING: define the correct hosts in production!
ALLOWED_HOSTS = ['*']
# INTERNAL_IPS = ("127.0.0.1", "172.17.0.1")
# # COMPRESS_ENABLED = os.environ.get('COMPRESS_ENABLED', False)
# # STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
DEBUG_PROPAGATE_EXCEPTIONS = True

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': ('%(asctime)s [%(process)d] [%(levelname)s] ' +
                       'pathname=%(pathname)s lineno=%(lineno)s ' +
                       'funcname=%(funcName)s %(message)s'),
            'datefmt': '%Y-%m-%d %H:%M:%S'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        }
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'testlogger': {
            'handlers': ['console'],
            'level': 'INFO',
        }
    }
}
try:
    from .local import *
except ImportError:
    pass
