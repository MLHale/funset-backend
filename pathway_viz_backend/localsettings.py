# Set to DEV for debug and other configuration items.  PROD otherwise...
ENVIRONMENT = 'DEV'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '<insert secret key here>'

#ROOT_URLCONF = 'urls'
ROOT_URLCONF = 'pathway_viz_backend.urls'
WSGI_APPLICATION = 'pathway_viz_backend.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'HOST': 'db',
        'PORT': 5432,
        'CONN_MAX_AGE' : 0,
    }
}

ALLOWED_HOSTS = ['137.48.191.135','localhost', 'django']
ENVIRONMENT = "PROD"
