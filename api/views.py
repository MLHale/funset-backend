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

class LoadEnrichmentsThread(Thread):
    def __init__(self, queue, enrichmentrun):
        super(LoadEnrichmentsThread, self).__init__()
        self.queue = queue
        self.enrichmentrun = enrichmentrun

    def run(self):
        while True:
            enrichmentinfo = self.queue.get()
            if enrichmentinfo != '\n':
                tokens = enrichmentinfo.split('\t')
                try:
                    term = Term.objects.get(termid=tokens[0])
                    enrichment = Enrichment(term=term,run=self.enrichmentrun,pvalue=float(tokens[2]),level=float(tokens[3].replace('\n','')))
                    enrichment.save()
                    for token in tokens[4].replace('\n','').split(' '):
                        gene = Gene.objects.get_or_create(geneid=token)[0]
                        enrichment.genes.add(gene)
                    enrichment.save()
                except Term.DoesNotExist:
                    print 'term %s was not in the database'% tokens[0]
                except IndexError:
                    print 'Error parsing term - IndexError'
            #signals to queue job is done
            self.queue.task_done()


class LoadCoordsThread(Thread):
    def __init__(self, queue, enrichmentrun):
        super(LoadCoordsThread, self).__init__()
        self.queue = queue
        self.enrichmentrun = enrichmentrun

    def run(self):
        while True:
            enrichmentinfo = self.queue.get()
            if enrichmentinfo != '\n':
                tokens = enrichmentinfo.split('\t')
                try:
                    enrichment = Enrichment.objects.get(run=self.enrichmentrun,term__termid=tokens[0])
                    enrichment.semanticdissimilarityx = float(tokens[1])
                    enrichment.semanticdissimilarityy = float(tokens[2].replace('\n',''))
                    enrichment.save()
                except Enrichment.DoesNotExist:
                    print 'term %s was not in the database'% tokens[0]
                except IndexError:
                    print ('Error parsing term - ', tokens, IndexError)
            #signals to queue job is done
            self.queue.task_done()

class LoadClustersThread(Thread):
    def __init__(self, queue, enrichmentrun):
        super(LoadClustersThread, self).__init__()
        self.queue = queue
        self.enrichmentrun = enrichmentrun

    def run(self):
        while True:
            enrichmentinfo = self.queue.get()
            if enrichmentinfo != '\n':
                tokens = enrichmentinfo.split('\t')
                try:
                    enrichment = Enrichment.objects.get(run=self.enrichmentrun,term__termid=tokens[0])
                    enrichment.cluster = int(tokens[1])
                    enrichment.medoid = 'True'==tokens[2].replace('\n','')
                    enrichment.save()
                except Enrichment.DoesNotExist:
                    print 'term %s was not in the database'% tokens[0]
                except IndexError:
                    print ('Error parsing term - ', IndexError)
            #signals to queue job is done
            self.queue.task_done()


class RunViewSet(viewsets.ModelViewSet):
    """
    API endpoint that loads overall Runs (user invocations of the enrichment util).
    """
    queryset = Run.objects.all()
    serializer_class = RunSerializer

    @detail_route()
    def recluster(self, request, pk):
        #need to add error handling and resilence
        start = time.time()
        print ('run',pk)
        clusters = self.request.query_params.get('clusters')
        if clusters is not None:
            if int(clusters)<=0:
                return Response({'error':'Not a valid number of clusters'},status=500)

            #files to be used by the GOUtil
            run_obj = Run.objects.get(id=pk)
            run_uuid = run_obj.name

            genefile_name = 'useruploads/inputgenes-' + run_uuid + '.txt'
            enrich_outputfile_name = 'useruploads/enrichment-' + run_uuid + '.txt'
            sim_outputfile_name = 'useruploads/funsim-' + run_uuid + '.txt'
            semsim_outputfile_name = 'useruploads/semsim-' + run_uuid + '.txt'
            clusters_outputfile_name = 'useruploads/clusters-' + run_uuid + '.txt'

            ###### Enrichment Pipeline ######
            try:
                clusters_outputfile = open(clusters_outputfile_name, 'w').close()#clear the file
            except IOError:
                print "Error cluster file doesn't exist"
                return Response({'error': 'You must run an enrichment before clustering.'},status=500)

            #spectral clustering
            spectral_start = time.time()
            subprocess.call(['python','/GOUtil/spectralClustering.py', semsim_outputfile_name, clusters_outputfile_name, clusters])
            print "Spectral run time %s" % (time.time()-spectral_start)

            try:
                clusters_outputfile = open(clusters_outputfile_name, 'r')
            except IOError:
                print "Error no clusters exist"
                return Response({'error': 'No clusters found for these Genes and Organism.'},status=500)
            #Multi-threaded loader to do the clustering and update the enrichment records

            cluster_queue = Queue.Queue()
            for i in range(5):
                t = LoadClustersThread(cluster_queue, run_obj)
                t.setDaemon(True)
                t.start()
            for line in clusters_outputfile:
                cluster_queue.put(line)

            cluster_queue.join()
            print "Loading time: %s" % (time.time()-start)

            enrichments = Enrichment.objects.filter(run=run_obj)
            serializer = RunIncludesSerializer(run_obj)
            #cleanup temp files
            clusters_outputfile.close()
            # os.remove(genefile_name)
            # os.remove(enrich_outputfile_name)
            return Response(serializer.data)
            # return Response({'runid': new_run.id})
        else:
            return Response({'error':'Not a valid number of clusters'},status=500)


    @list_route()
    def invoke(self, request):
        return Response({"type":"runs","id":"110","attributes":{"name":"b43fd6ef-8fbd-430a-a87a-17afab8df0b1","created":"2017-12-21","ip":"172.20.0.1"},"relationships":{"enrichments":{"data":[{"type":"Enrichment","id":"4732"},{"type":"Enrichment","id":"4761"},{"type":"Enrichment","id":"4775"},{"type":"Enrichment","id":"4777"},{"type":"Enrichment","id":"4789"},{"type":"Enrichment","id":"4796"},{"type":"Enrichment","id":"4746"},{"type":"Enrichment","id":"4750"},{"type":"Enrichment","id":"4762"},{"type":"Enrichment","id":"4763"},{"type":"Enrichment","id":"4734"},{"type":"Enrichment","id":"4745"},{"type":"Enrichment","id":"4773"},{"type":"Enrichment","id":"4786"},{"type":"Enrichment","id":"4793"},{"type":"Enrichment","id":"4735"},{"type":"Enrichment","id":"4758"},{"type":"Enrichment","id":"4767"},{"type":"Enrichment","id":"4804"},{"type":"Enrichment","id":"4814"},{"type":"Enrichment","id":"4736"},{"type":"Enrichment","id":"4748"},{"type":"Enrichment","id":"4752"},{"type":"Enrichment","id":"4756"},{"type":"Enrichment","id":"4760"},{"type":"Enrichment","id":"4771"},{"type":"Enrichment","id":"4780"},{"type":"Enrichment","id":"4737"},{"type":"Enrichment","id":"4743"},{"type":"Enrichment","id":"4770"},{"type":"Enrichment","id":"4783"},{"type":"Enrichment","id":"4792"},{"type":"Enrichment","id":"4797"},{"type":"Enrichment","id":"4806"},{"type":"Enrichment","id":"4810"},{"type":"Enrichment","id":"4818"},{"type":"Enrichment","id":"4738"},{"type":"Enrichment","id":"4751"},{"type":"Enrichment","id":"4764"},{"type":"Enrichment","id":"4768"},{"type":"Enrichment","id":"4774"},{"type":"Enrichment","id":"4779"},{"type":"Enrichment","id":"4782"},{"type":"Enrichment","id":"4805"},{"type":"Enrichment","id":"4820"},{"type":"Enrichment","id":"4739"},{"type":"Enrichment","id":"4742"},{"type":"Enrichment","id":"4747"},{"type":"Enrichment","id":"4753"},{"type":"Enrichment","id":"4759"},{"type":"Enrichment","id":"4766"},{"type":"Enrichment","id":"4788"},{"type":"Enrichment","id":"4740"},{"type":"Enrichment","id":"4755"},{"type":"Enrichment","id":"4741"},{"type":"Enrichment","id":"4744"},{"type":"Enrichment","id":"4749"},{"type":"Enrichment","id":"4754"},{"type":"Enrichment","id":"4800"},{"type":"Enrichment","id":"4809"},{"type":"Enrichment","id":"4816"},{"type":"Enrichment","id":"4757"},{"type":"Enrichment","id":"4765"},{"type":"Enrichment","id":"4769"},{"type":"Enrichment","id":"4772"},{"type":"Enrichment","id":"4799"},{"type":"Enrichment","id":"4807"},{"type":"Enrichment","id":"4813"},{"type":"Enrichment","id":"4819"},{"type":"Enrichment","id":"4790"},{"type":"Enrichment","id":"4794"},{"type":"Enrichment","id":"4798"},{"type":"Enrichment","id":"4801"},{"type":"Enrichment","id":"4808"},{"type":"Enrichment","id":"4817"},{"type":"Enrichment","id":"4778"},{"type":"Enrichment","id":"4784"},{"type":"Enrichment","id":"4781"},{"type":"Enrichment","id":"4785"},{"type":"Enrichment","id":"4802"},{"type":"Enrichment","id":"4812"},{"type":"Enrichment","id":"4787"},{"type":"Enrichment","id":"4791"},{"type":"Enrichment","id":"4795"},{"type":"Enrichment","id":"4815"},{"type":"Enrichment","id":"4803"},{"type":"Enrichment","id":"4811"},{"type":"Enrichment","id":"4821"},{"type":"Enrichment","id":"4824"},{"type":"Enrichment","id":"4831"},{"type":"Enrichment","id":"4845"},{"type":"Enrichment","id":"4822"},{"type":"Enrichment","id":"4826"},{"type":"Enrichment","id":"4834"},{"type":"Enrichment","id":"4836"},{"type":"Enrichment","id":"4823"},{"type":"Enrichment","id":"4830"},{"type":"Enrichment","id":"4841"},{"type":"Enrichment","id":"4825"},{"type":"Enrichment","id":"4832"},{"type":"Enrichment","id":"4843"},{"type":"Enrichment","id":"4827"},{"type":"Enrichment","id":"4837"},{"type":"Enrichment","id":"4844"},{"type":"Enrichment","id":"4828"},{"type":"Enrichment","id":"4835"},{"type":"Enrichment","id":"4842"},{"type":"Enrichment","id":"4829"},{"type":"Enrichment","id":"4833"},{"type":"Enrichment","id":"4839"},{"type":"Enrichment","id":"4846"},{"type":"Enrichment","id":"4850"},{"type":"Enrichment","id":"4838"},{"type":"Enrichment","id":"4847"},{"type":"Enrichment","id":"4840"},{"type":"Enrichment","id":"4848"},{"type":"Enrichment","id":"4849"},{"type":"Enrichment","id":"4733"},{"type":"Enrichment","id":"4776"}]}}})
        # #need to add error handling and resilence
        # start = time.time()
        # genes = self.request.query_params.get('genes')
        # pvalue = self.request.query_params.get('pvalue')
        # clusters = self.request.query_params.get('clusters')
        # organism = self.request.query_params.get('organism')
        # if genes is not None and pvalue is not None and clusters is not None:
        #     if organism not in ['hsa','gga','bta','cfa','mmu','rno','cel','ath','dme','sce','eco','dre'] or int(clusters)<=0:
        #         return Response({},status=500)
        #
        #     genes = bleach.clean(genes)
        #     genes = unquote(genes).replace(',', '\n')
        #
        #     #temp files to be used by the GOUtil
        #     tmp_uuid = str(uuid.uuid4())
        #     genefile_name = 'useruploads/inputgenes-' + tmp_uuid + '.txt'
        #     enrich_outputfile_name = 'useruploads/enrichment-' + tmp_uuid + '.txt'
        #     sim_outputfile_name = 'useruploads/funsim-' + tmp_uuid + '.txt'
        #     semsim_outputfile_name = 'useruploads/semsim-' + tmp_uuid + '.txt'
        #     clusters_outputfile_name = 'useruploads/clusters-' + tmp_uuid + '.txt'
        #     genefile = open(genefile_name, 'w+')
        #
        #     genefile.write(genes)
        #     genefile.close()
        #
        #     new_run = Run(name=tmp_uuid,ip=get_ip(request))
        #     new_run.save()
        #     base_dir = '/GOUtildata/'
        #     annotation_file_name = base_dir+'ann.'+organism+'.bp.txt'
        #     edgelist_file_name = base_dir+'edgeList.'+'bp.txt'
        #     background_file_name = base_dir+'background.txt'
        #
        #     ###### Enrichment Pipeline ######
        #     #invoke enrichment util to compute enrichments
        #     e_start = time.time()
        #     subprocess.call(['/GOUtil/./enrich', '-a', annotation_file_name, '-e', edgelist_file_name, '-t', genefile_name, '-b', background_file_name, '-o', enrich_outputfile_name, '-p', pvalue])
        #     print "Enrich run time %s" % (time.time()-e_start)
        #
        #     try:
        #         enrich_outputfile = open(enrich_outputfile_name, 'r')
        #     except IOError:
        #         print "Error no enrichment file."
        #         return Response({'error': 'Enrichment analysis failed for these Genes and Organism.'},status=500)
        #     #Multi-threaded loader to load in all of the enrichment terms
        #     enrich_queue = Queue.Queue()
        #     for i in range(10):
        #         t = LoadEnrichmentsThread(enrich_queue, new_run)
        #         t.setDaemon(True)
        #         t.start()
        #     for line in enrich_outputfile:
        #         enrich_queue.put(line)
        #
        #
        #
        #     fun_sim_start = time.time()
        #     #invoke funSim util to compute semantic similarity
        #     subprocess.call(['/GOUtil/./funSim', '-a', annotation_file_name, '-e', edgelist_file_name, '-o', sim_outputfile_name, '-t',"Lin", '-f', enrich_outputfile_name])
        #     print "FunSim run time %s" % (time.time()-fun_sim_start)
        #
        #
        #     mds_sim_start = time.time()
        #     #compute x, y coordinates for enriched terms
        #     subprocess.call(['python','/GOUtil/mdsSemSim.py', sim_outputfile_name, semsim_outputfile_name])
        #     print "MDS run time %s" % (time.time()-mds_sim_start)
        #
        #     #Multi-threaded loader to load in all of the enrichment term coordinates
        #     try:
        #         semsim_outputfile = open(semsim_outputfile_name, 'r')
        #     except IOError:
        #         print "Error No MDS file"
        #         return Response({'error': 'Semantic Similarity Computation Failed for these Genes and Organism.'},status=500)
        #     enrich_queue.join()
        #     coords_queue = Queue.Queue()
        #     for i in range(5):
        #         t = LoadCoordsThread(coords_queue, new_run)
        #         t.setDaemon(True)
        #         t.start()
        #     for line in semsim_outputfile:
        #         coords_queue.put(line)
        #
        #     #spectral clustering
        #     spectral_start = time.time()
        #     subprocess.call(['python','/GOUtil/spectralClustering.py', semsim_outputfile_name, clusters_outputfile_name, clusters])
        #     print "Spectral run time %s" % (time.time()-spectral_start)
        #
        #     try:
        #         clusters_outputfile = open(clusters_outputfile_name, 'r')
        #     except IOError:
        #         print "Error no clusters exist"
        #         return Response({'error': 'No clusters found for these Genes and Organism.'},status=500)
        #     #Multi-threaded loader to do the clustering and update the enrichment records
        #     coords_queue.join()
        #     cluster_queue = Queue.Queue()
        #     for i in range(5):
        #         t = LoadClustersThread(cluster_queue, new_run)
        #         t.setDaemon(True)
        #         t.start()
        #     for line in clusters_outputfile:
        #         cluster_queue.put(line)
        #
        #     cluster_queue.join()
        #     print "Loading time: %s" % (time.time()-start)
        #
        #     serializer = RunSerializer(new_run)
        #     #cleanup temp files
        #     enrich_outputfile.close()
        #     semsim_outputfile.close()
        #     clusters_outputfile.close()
        #     # os.remove(genefile_name)
        #     # os.remove(enrich_outputfile_name)
        #     return Response(serializer.data)
        #     # return Response({'runid': new_run.id})
        # else:
        #     return Response({},status=500)


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
