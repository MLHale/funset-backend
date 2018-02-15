# @Author: Matthew Hale <mlhale>
# @Date:   2018-02-14T23:03:27-06:00
# @Email:  mlhale@unomaha.edu
# @Filename: localsettings.py
# @Last modified by:   mlhale
# @Last modified time: 2018-02-15T00:20:41-06:00
# @License: Funset is a web-based BIOI tool for visualizing genetic pathway information. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
# @Copyright: Copyright (C) 2017 Matthew L. Hale, Dario Ghersi, Ishwor Thapa



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
ENVIRONMENT = "DEV"
