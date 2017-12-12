#from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import *
from django.contrib.auth import *
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from api.serializers import *
#from django.shortcuts import render_to_response
from django.template import RequestContext
from django_filters.rest_framework import DjangoFilterBackend


from django.shortcuts import *

# Import models
from django.db import models
from django.contrib.auth.models import *
from api.models import *

#REST API
from rest_framework_json_api import parsers
from rest_framework import viewsets, filters
from django.http import Http404, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import *
from rest_framework.decorators import *
from rest_framework.authentication import *

#filters
#from filters.mixins import *
from api.serializers import *
from api.pagination import *
from pathway_viz_backend import settings
import math
from django.core.cache import cache
import bleach
import time
from django.core import serializers
import subprocess

from urllib import unquote
class TermViewSet(viewsets.ModelViewSet):
    """
    API endpoint that handles requests for terms.
    """
    resource_name = 'terms'
    queryset = Term.objects.order_by('termid')
    serializer_class = TermSerializer
    permission_classes = []
    authentication_classes = []

    def get_queryset(self):
        queryset = Term.objects.order_by('termid')
        # Set up eager loading to avoid N+1 selects

        queryterms = self.request.query_params.get('termids')

        if queryterms is not None:
            queryterms = unquote(queryterms).split(',')
            print queryterms
            print 'filtering'
            queryset = self.get_serializer_class().setup_eager_loading(Term.objects.filter(termid__in=queryterms).order_by('termid'))
        else:
            queryset = self.get_serializer_class().setup_eager_loading(Term.objects.order_by('termid'))
        return queryset

    @list_route()
    def get_pages(self, request):
        objs = Term.objects.order_by('termid').count()
        return Response({'count': objs, 'pages': int(math.ceil(float(objs)/settings.REST_FRAMEWORK['PAGE_SIZE']))})

    # def list(self, request, *args, **kwargs):
    #     queryset = self.filter_queryset(self.get_queryset())
    #
    #     page = self.paginate_queryset(queryset)
    #     if page is not None:
    #         serializer = self.get_serializer(page, many=True)
    #         return cache.get_or_set('term_list_paginated',self.get_paginated_response(serializer.data))
    #
    #     serializer = self.get_serializer(queryset, many=True)
    #     term_response = cache.get_or_set('term_list', Response(serializer.data))
    #     return term_response



class GeneViewSet(viewsets.ModelViewSet):
    """
    API endpoint that handles requests for gene data.
    """
    resource_name = 'genes'
    queryset = Gene.objects.all()
    serializer_class = GeneSerializer


class EnrichmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that handles requests for enrichment terms.
    """
    resource_name = 'enrichments'
    queryset = Enrichment.objects.all()
    serializer_class = EnrichmentSerializer

import uuid
import os
from ipware.ip import get_ip
from threading import Thread
import Queue

class LoadThread(Thread):
    def __init__(self, queue, enrichmentrun):
        super(LoadThread, self).__init__()
        self.queue = queue
        self.enrichmentrun = enrichmentrun

    def run(self):
        while True:
            enrichmentinfo = self.queue.get()
            if enrichmentinfo != '\n':
                tokens = enrichmentinfo.split('\t')
                try:
                    term = Term.objects.get(termid=tokens[0])
                    enrichment = Enrichment(term=term,pvalue=tokens[1],level=tokens[2].replace('\n',''))
                    enrichment.save()
                    self.enrichmentrun.enrichments.add(enrichment)
                except Term.DoesNotExist:
                    print 'term %s was not in the database'% tokens[0]
            #signals to queue job is done
            self.queue.task_done()


class RunViewSet(viewsets.ModelViewSet):
    """
    API endpoint that loads overall Runs (user invocations of the enrichment util).
    """
    resource_name = 'runs'
    queryset = Run.objects.all()
    serializer_class = RunSerializer

    @list_route()
    def invoke(self, request):
        #need to add error handling and resilence
        genes = self.request.query_params.get('genes')
        pvalue = self.request.query_params.get('pvalue')
        if genes is not None and pvalue is not None:
            genes = bleach.clean(genes)
            genes = unquote(genes).replace(',', '\n')

            #temp files to be used by the GOUtil
            tmp_uuid = str(uuid.uuid4())
            genefile_name = '/GOUtil/data/inputgenes' + tmp_uuid + '.txt'
            outputfile_name = '/GOUtil/data/output' + tmp_uuid + '.txt'
            genefile = open(genefile_name, 'w+')

            genefile.write(genes)
            genefile.close()
            #invoke enrichment util
            process = subprocess.call(['/GOUtil/./enrich', '-a', '/GOUtil/data/annHuman20171106_noIEA_noND_noRCA.txt', '-e', '/GOUtil/data/edgeList20171106.txt', '-t', genefile_name, '-b', '/GOUtil/data/background.txt', '-o', outputfile_name])
            outputfile = open(outputfile_name, 'r')
            new_run = Run(name=get_ip(request))
            new_run.save()

            #Multi-threaded loader to load in all of the enrichment terms (currently loads all)
            queue = Queue.Queue()
            start = time.time()
            threads = []

            for i in range(5):
                t = LoadThread(queue, new_run)
                t.setDaemon(True)
                t.start()
            for line in outputfile:
                if float(line.split('\t')[1]) < float(pvalue):
                    print line.split('\t')[1]
                    print "Loading term %s, with p-value: %s" % (line.split('\t')[0], line.split('\t')[1])
                    queue.put(line)
                else:
                    print "Ignoring term %s, with p-value: %s" % (line.split('\t')[0], line.split('\t')[1])

            queue.join()
            print "Loading time: %s" % (time.time()-start)

            serializer = RunSerializer(new_run)
            #cleanup temp files
            outputfile.close()

            os.remove(genefile_name)
            os.remove(outputfile_name)
            return Response(serializer.data)
            # return Response({'runid': new_run.id})
        else:
            return Response({},status=500)


class Register(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        # Login
        username = request.POST.get('username') #you need to apply validators to these
        print username
        password = request.POST.get('password') #you need to apply validators to these
        email = request.POST.get('email') #you need to apply validators to these
        gender = request.POST.get('gender') #you need to apply validators to these
        age = request.POST.get('age') #you need to apply validators to these
        educationlevel = request.POST.get('educationlevel') #you need to apply validators to these
        city = request.POST.get('city') #you need to apply validators to these
        state = request.POST.get('state') #you need to apply validators to these

        print request.POST.get('username')
        if User.objects.filter(username=username).exists():
            return Response({'username': 'Username is taken.', 'status': 'error'})
        elif User.objects.filter(email=email).exists():
            return Response({'email': 'Email is taken.', 'status': 'error'})

        #especially before you pass them in here
        newuser = User.objects.create_user(email=email, username=username, password=password)
        newprofile = Profile(user=newuser, gender=gender, age=age, educationlevel=educationlevel, city=city, state=state)
        newprofile.save()
        return Response({'status': 'success', 'userid': newuser.id, 'profile': newprofile.id})

class Session(APIView):
    permission_classes = (AllowAny,)
    def form_response(self, isauthenticated, userid, username, error=""):
        data = {
            'isauthenticated': isauthenticated,
            'userid': userid,
            'username': username
        }
        if error:
            data['message'] = error

        return Response(data)

    def get(self, request, *args, **kwargs):
        # Get the current user
        if request.user.is_authenticated():
            return self.form_response(True, request.user.id, request.user.username)
        return self.form_response(False, None, None)

    def post(self, request, *args, **kwargs):
        # Login
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return self.form_response(True, user.id, user.username)
            return self.form_response(False, None, None, "Account is suspended")
        return self.form_response(False, None, None, "Invalid username or password")

    def delete(self, request, *args, **kwargs):
        # Logout
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
