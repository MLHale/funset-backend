# @Author: Matthew Hale <mlhale>
# @Date:   2018-02-15T00:14:57-06:00
# @Email:  mlhale@unomaha.edu
# @Filename: views.py
# @Last modified by:   matthale
# @Last modified time: 2018-12-24T02:48:26-06:00
# @License: Funset is a web-based BIOI tool for visualizing genetic pathway information. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
# @Copyright: Copyright (C) 2017 Matthew L. Hale, Dario Ghersi, Ishwor Thapa



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
from rest_framework import parsers as parsers_normal
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

import uuid
import os
from ipware.ip import get_ip


from multiprocessing import Pool, Lock, Manager, Process
from functools import partial
from django import db
import sys

def home(request):
	"""
	Send requests to '/' to the ember.js clientside app
	"""

	return render(request, 'index.html')

class OntologyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that handles requests for Ontologies.
    """
    resource_name = 'ontologies'
    queryset = Ontology.objects.order_by('name')
    serializer_class = OntologySerializer
    permission_classes = []
    authentication_classes = []

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
            # print queryterms
            # print 'filtering'
            queryset = self.get_serializer_class().setup_eager_loading(Term.objects.filter(termid__in=queryterms).order_by('termid'))
        else:
            queryset = self.get_serializer_class().setup_eager_loading(Term.objects.order_by('termid'))
        return queryset

    @list_route()
    def get_pages(self, request):
		namespace = str(self.request.query_params.get('namespace'))
		ontology_id = int(self.request.query_params.get('goontology'))
		
		if namespace is not None and ontology_id is not None:
			objs = Term.objects.filter(ontology__id=ontology_id).order_by('termid').count()
			return Response({'count': objs, 'pages': int(math.ceil(float(objs)/settings.REST_FRAMEWORK['PAGE_SIZE']))})
		else:
			return Response({'error':'Not a valid namespace/ontology pair'},status=500)
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


def loadEnrichmentsWorker(lock, enrichmentdata):
    db.connection.close()
    enrichmentrun, enrichmentinfo, ontology = enrichmentdata
    if enrichmentinfo != '\n':
        tokens = enrichmentinfo.split('\t')
        try:
            term = Term.objects.get(ontology__id=ontology, termid=tokens[0])
            run = Run.objects.get(id=enrichmentrun)
            enrichment = Enrichment(term=term,run=run,pvalue=float(tokens[2]),level=10*math.log(float(tokens[3].replace('\n',''))))
            enrichment.save()
            for token in tokens[4].replace('\n','').split(' '):
                gene = Gene.objects.get_or_create(geneid=token)[0]
                enrichment.genes.add(gene)
            enrichment.save()
        except Enrichment.DoesNotExist:
            print 'term %s was not in the database'% tokens[0]
        except IndexError:
            print ('Error parsing term - ', IndexError)
        except db.utils.DatabaseError as e:
            print ('DatabaseError', e)
        # except:
        #     print("Unexpected error:", sys.exc_info()[0])


def loadCoordsWorker(lock, enrichmentdata):
    db.connection.close()
    enrichmentrun, enrichmentinfo = enrichmentdata
    if enrichmentinfo != '\n':
        tokens = enrichmentinfo.split('\t')
        try:
            enrichment = Enrichment.objects.get(run__id=enrichmentrun,term__termid=tokens[0])
            enrichment.semanticdissimilarityx = float(tokens[1])
            enrichment.semanticdissimilarityy = float(tokens[2].replace('\n',''))
            enrichment.save()
        except Enrichment.DoesNotExist:
            print 'term %s was not in the database'% tokens[0]
        except IndexError:
            print ('Error parsing term - ', IndexError)
        except db.utils.DatabaseError as e:
            print ('DatabaseError', e)
        except:
            print("Unexpected error:", sys.exc_info()[0])

def loadClustersWorker(lock, enrichmentdata):
    db.connection.close()
    enrichmentrun, enrichmentinfo = enrichmentdata
    # print('clusterworker',enrichmentrun, enrichmentinfo)
    # print lock
    if enrichmentinfo != '\n':
        tokens = enrichmentinfo.split('\t')
        try:
            enrichment = Enrichment.objects.get(run__id=enrichmentrun,term__termid=tokens[0])
            enrichment.cluster = int(tokens[1])
            enrichment.medoid = 'True'==tokens[2].replace('\n','')
            # lock.acquire()
            enrichment.save()
            # print ('enrichment',enrichment.cluster,enrichment)
            # lock.release()
        except Enrichment.DoesNotExist:
            print 'term %s was not in the database'% tokens[0]
        except IndexError:
            print ('Error parsing term - ', IndexError)
        except db.utils.DatabaseError as e:
            print ('DatabaseError', e)
        except:
            print("Unexpected error:", sys.exc_info()[0])


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
        # print ('run',pk)
        clusters = self.request.query_params.get('clusters')
        # print ('clusters',clusters)
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

            ###### Data Processing Pipeline ######
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


            #Multi-threaded loader to update the cluster data
            load_start = time.time()
            manager = Manager()
            lock = manager.Lock()
            taskworker = partial(loadClustersWorker, lock)
            pool = Pool(5)
            tokens = [(run_obj.id, line) for line in clusters_outputfile]

            pool.map(taskworker, tokens)
            pool.close()
            pool.join()
            print "Multi-threading Loading time: %s" % (time.time()-load_start)

            # single_load_start = time.time()
            # for (enrichmentrun, enrichmentinfo) in tokens:
            #     token = enrichmentinfo.split('\t')
            #     enrichment = Enrichment.objects.get(run__id=enrichmentrun,term__termid=token[0])
            #     enrichment.cluster = int(token[1])
            #     enrichment.medoid = 'True'==token[2].replace('\n','')
            #     enrichment.save()
            # print "Single Threaded Loading time: %s" % (time.time()-single_load_start)

            db.connection.close()


            serializer = RunIncludesSerializer(run_obj)

            #cleanup files
            clusters_outputfile.close()

            print "Overall Loading time: %s" % (time.time()-start)
            return Response(serializer.data)
        else:
            return Response({'error':'Not a valid number of clusters'},status=500)


    @list_route(methods=['post'], parser_classes=[parsers_normal.FormParser,])
    def invoke(self, request):
        #need to add error handling and resilence
        start = time.time()
        genes = request.data.get('genes')
        pvalue = request.data.get('pvalue')
        clusters = request.data.get('clusters')
        organism = request.data.get('organism')
        background = request.data.get('background')
        namespace = request.data.get('namespace')
        goontology = request.data.get('goontology')
        if genes is not None and pvalue is not None and clusters is not None and goontology is not None:
            if organism not in ['hsa','gga','bta','cfa','mmu','rno','cel','ath','dme','sce','eco','dre'] or int(clusters)<=0:
                return Response({'error': 'Organism type and/or clusters are not valid parameters'},status=500)

            genes = bleach.clean(genes).replace(',', '\n')
            background = bleach.clean(background)
            goontology = bleach.clean(goontology)

            try:
                ontology = Ontology.objects.get(pk=int(goontology))
            except Ontology.DoesNotExist:
                return Response({'error':'Ontology does not exist'},status=404)

            #temp files to be used by the GOUtil
            tmp_uuid = str(uuid.uuid4())
            genefile_name = 'useruploads/inputgenes-' + tmp_uuid + '.txt'
            enrich_outputfile_name = 'useruploads/enrichment-' + tmp_uuid + '.txt'
            sim_outputfile_name = 'useruploads/funsim-' + tmp_uuid + '.txt'
            semsim_outputfile_name = 'useruploads/semsim-' + tmp_uuid + '.txt'
            clusters_outputfile_name = 'useruploads/clusters-' + tmp_uuid + '.txt'
            genefile = open(genefile_name, 'w+')

            genefile.write(genes)
            genefile.close()

            new_run = Run(name=tmp_uuid,ip=get_ip(request))
            new_run.save()
            base_dir = '/GOUtildata/'+ontology.name+'/'
            annotation_file_name = base_dir+'ann.'+organism+'.'+namespace+'.txt'
            edgelist_file_name = base_dir+'edgeList.'+'bp.txt'

            if background:
                background_file_name = 'useruploads/background-' + tmp_uuid + '.txt'
                backgroundfile = open(background_file_name, 'w+')

                backgroundfile.write(background)
                backgroundfile.close()
            else:
                background_file_name = base_dir+'background.'+organism+'.'+namespace+'.txt'

            ###### Enrichment Pipeline ######
            #invoke enrichment util to compute enrichments
            e_start = time.time()


            subprocess.call(['/GOUtil/./enrich', '-a', annotation_file_name, '-e', edgelist_file_name, '-t', genefile_name, '-b', background_file_name, '-o', enrich_outputfile_name, '-p', pvalue])
            print "Enrich run time %s" % (time.time()-e_start)

            try:
                enrich_outputfile = open(enrich_outputfile_name, 'r')
            except IOError:
                print "Error no enrichment file."
                return Response({'error': 'No Enrichment found for these Genes and Organism.'},status=500)
            #Multi-threaded loader to load in all of the enrichment terms
            enrich_manager = Manager()
            enrich_lock = enrich_manager.Lock()
            enrich_taskworker = partial(loadEnrichmentsWorker, enrich_lock)
            enrich_pool = Pool(8)
            enrich_tokens = [(new_run.id, line, ontology.id) for line in enrich_outputfile]

            enrich_pool.map(enrich_taskworker, enrich_tokens)

            fun_sim_start = time.time()
            #invoke funSim util to compute semantic similarity
            subprocess.call(['/GOUtil/./funSim', '-a', annotation_file_name, '-e', edgelist_file_name, '-o', sim_outputfile_name, '-t',"Lin", '-f', enrich_outputfile_name])
            print "FunSim run time %s" % (time.time()-fun_sim_start)


            mds_sim_start = time.time()
            #compute x, y coordinates for enriched terms
            subprocess.call(['python','/GOUtil/mdsSemSim.py', sim_outputfile_name, semsim_outputfile_name])
            print "MDS run time %s" % (time.time()-mds_sim_start)

            #Multi-threaded loader to load in all of the enrichment term coordinates
            try:
                semsim_outputfile = open(semsim_outputfile_name, 'r')
            except IOError:
                print "Error No MDS file"
                return Response({'error': 'Semantic Similarity Computation Failed for these Genes and Organism.'},status=500)

            # ensure enrichments are loaded before proceeding
            enrich_pool.close()
            enrich_pool.join()

            coord_manager = Manager()
            coord_lock = coord_manager.Lock()
            coord_taskworker = partial(loadCoordsWorker, coord_lock)
            coord_pool = Pool(5)
            coord_tokens = [(new_run.id, line) for line in semsim_outputfile]

            coord_pool.map(coord_taskworker, coord_tokens)
            coord_pool.close()
            coord_pool.join()

            #spectral clustering
            spectral_start = time.time()
            subprocess.call(['python','/GOUtil/spectralClustering.py', semsim_outputfile_name, clusters_outputfile_name, clusters])
            print "Spectral run time %s" % (time.time()-spectral_start)

            try:
                clusters_outputfile = open(clusters_outputfile_name, 'r')
            except IOError:
                print "Error no clusters exist"
                return Response({'error': 'No clusters found for these Genes and Organism.'},status=500)

            #Multi-threaded loader to update the cluster data
            cluster_manager = Manager()
            cluster_lock = cluster_manager.Lock()
            cluster_taskworker = partial(loadClustersWorker, cluster_lock)
            cluster_pool = Pool(5)
            cluster_tokens = [(new_run.id, line) for line in clusters_outputfile]

            cluster_pool.map(cluster_taskworker, cluster_tokens)
            cluster_pool.close()
            cluster_pool.join()

            print "Loading time: %s" % (time.time()-start)
            db.connection.close()
            serializer = RunSerializer(new_run)
            #cleanup temp files
            enrich_outputfile.close()
            semsim_outputfile.close()
            clusters_outputfile.close()
            # os.remove(genefile_name)
            # os.remove(enrich_outputfile_name)
            return Response(serializer.data)
            # return Response({'runid': new_run.id})
        else:
            return Response({'error': 'Invalid parameters'},status=500)


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
