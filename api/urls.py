# @Author: Matthew Hale <mlhale>
# @Date:   2018-02-14T23:03:27-06:00
# @Email:  mlhale@unomaha.edu
# @Filename: urls.py
# @Last modified by:   mlhale
# @Last modified time: 2018-02-16T00:58:28-06:00
# @License: Funset is a web-based BIOI tool for visualizing genetic pathway information. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
# @Copyright: Copyright (C) 2017 Matthew L. Hale, Dario Ghersi, Ishwor Thapa



from django.conf.urls import include, url

#Django Rest Framework
from rest_framework import routers

from api import views
from django.views.decorators.csrf import csrf_exempt

#from rest_framework.urlpatterns import format_suffix_patterns

#REST API routes
router = routers.DefaultRouter(trailing_slash=False)
router.register(r'terms', views.TermViewSet)
router.register(r'genes', views.GeneViewSet)
router.register(r'runs', views.RunViewSet)
router.register(r'enrichments', views.EnrichmentViewSet)
router.register(r'ontologies', views.OntologyViewSet)

#REST API
urlpatterns = [
    url(r'^session/', views.Session.as_view()),
    url(r'^register', csrf_exempt(views.Register.as_view())),
    url(r'^', include(router.urls)),

    #Django Rest Auth
    url(r'^auth/', include('rest_framework.urls')),

]
