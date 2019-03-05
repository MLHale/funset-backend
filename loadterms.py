# @Author: Matthew Hale <mlhale>
# @Date:   2018-02-14T23:03:27-06:00
# @Email:  mlhale@unomaha.edu
# @Filename: loadterms.py
# @Last modified by:   mlhale
# @Last modified time: 2019-03-05T12:58:24-06:00
# @License: Funset is a web-based BIOI tool for visualizing genetic pathway information. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
# @Copyright: Copyright (C) 2017 Matthew L. Hale, Dario Ghersi, Ishwor Thapa



import os
import sys
import getopt
import django
import datetime
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pathway_viz_backend.settings")

django.setup()

# your imports, e.g. Django models
from api.models import *
from multiprocessing import Pool, Lock, Manager, Process
from functools import partial
from django import db
import time

def help():
    print 'Usage: loadterms.py -i <inputfile> \n'
    print 'Parses terms stated in .obo format and loads them into the pathway_viz Datebase using Django\'s ORM.\n'
    print 'Required Arguments:'
    print '\t-i <inputfile>\t\tThe obo file containing the terms to be loaded.\n'
    print '\t-n <name>\t\tThe directory name where the data is to be stored for the ontology.\n'
    print '\t-d <desc>\t\tA Description of the ontology data.\n'
    print 'Optional Arguments:'
    print '\t -h, --help\t\tShow this help message and exit'

######################################################################
# parseGO.py                                                         #
# Author:  Dario Ghersi                                              #
# Version: 20190301                                                  #
# Goal:    parse the GO obo file and return a dictionary containing  #
#          1. GO ID; 2. term name; 3. term definition; 4. namespace; #
#          and 5. parent terms                                       #
# Usage:   parseGO.py obo                                            #
######################################################################

import re
import sys

######################################################################
# FUNCTIONS                                                          #
######################################################################

def parseGO(goData, regulatoryLinks=False):
  """
  Build and return a dictionary with term id, term name,
  term definition, namespace, parent terms.
  If the 'regulatoryLinks' is on, the edge type 'regulates'
  will be included in the graph
  N.B. If regulatory links are included, edges that go from one
  namespace to another will be present (e.g. some
  "biological_process" term will regulate some other
  "molecular_function" term)!!
  """

  oboDict = {}
  writeTerm = False
  termID = ""; name = ""; namespace = ""; definition = ""
  parents = []; altIDs = []
  
  for line in oboData:
    if line[0] == "[": # new term
      if writeTerm:
        oboDict[termID] = [name, namespace, definition, list(set(parents))]
        if len(altIDs) > 0:
          for altID in altIDs:
            oboDict[altID] = [name, namespace, definition, list(set(parents))]

      else:
        writeTerm = True
              
      parents = []
      altIDs = []
      
    # term id
    if re.search("^id:", line):
      termID = line[:-1].split("id: ")[1]

    if re.search("^alt_id: ", line):
      altIDs.append(line[:-1].split("alt_id: ")[1])

    # term name
    if re.search("^name:", line):
      name = line[:-1].split("name: ")[1]

    # namespace
    if re.search("^namespace: ", line):
      namespace = line[:-1].split("namespace: ")[1]

    # definition
    if re.search("^def: ", line):
      definition = line[:-1].split("def: ")[1]

    # parents
    if re.search("^is_a: ", line):
      parents.append(line.split("is_a: ")[1].split()[0])

    if re.search("^relationship: part_of ", line):
      parents.append(line.split("relationship: part_of ")[1].split()[0])

    if regulatoryLinks and re.search("relationship: regulates ", line):
      parents.append(line.split("relationship: regulates ")[1].split()[0])

  ## write the last record
  oboDict[termID] = [name, namespace, definition, list(set(parents))]
  if len(altIDs) > 0:
    for altID in altIDs:
      oboDict[altID] = [name, namespace, definition, list(set(parents))]
      
  return oboDict

#######################################################################
# MAIN PROGRAM                                                        #
#######################################################################

def loadTermParentsWorker(lock, data):
    db.connection.close()
    key, term, ontology = data
    record = Term.objects.get(ontology=ontology, termid=key)
    for parent in term[3]:
        # find parent in Django ORM and link
        parent_record = Term.objects.get(ontology=ontology, termid=parent)
        record.parents.add(parent_record)


if __name__ == '__main__':
    inputfile = ''
    ontology_name = ''
    ontology_desc = ''
    try:
        # Accept options -h, -i, -n
        opts, args = getopt.getopt(sys.argv[1:], "hi:n:d:")
    except getopt.GetoptError:
        help()
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            help()
            sys.exit()
        elif opt == "-i":
            inputfile = arg
        elif opt == '-n':
            ontology_name = arg
        elif opt == '-d':
            ontology_desc = arg


    if inputfile != '' and ontology_name !='':
        print 'Loading terms from:', inputfile, 'using ParseGO...'
        ## process the GO file
        oboFile = open(inputfile, "r")
        oboData = oboFile.readlines()
        oboFile.close()
        oboDict = parseGO(oboData)
        print '...done'
        print 'Creating New ontology:', ontology_name
        ontology= Ontology(name=ontology_name, created=datetime.datetime.now(), description=ontology_desc)
        ontology.save()
        print '...done'
        print 'Adding terms to',ontology_name,'...'
        for key, term in oboDict.items():
            newterm = Term(ontology=ontology, termid=key, name=term[0],
                            description=term[2], namespace=term[1], semanticdissimilarityx=0, semanticdissimilarityy=0 )
            newterm.save()
        print '...done'
        print 'Forming many-to-many mapping from term to parents (multithreaded)...'
        
        #Multi-threaded loader to update parent data
        load_start = time.time()
        manager = Manager()
        lock = manager.Lock()
        taskworker = partial(loadTermParentsWorker, lock)
        pool = Pool(5)
        tokens = [(key, term, ontology) for key, term in oboDict.items()]

        pool.map(taskworker, tokens)
        pool.close()
        pool.join()
        print "time to loadparents: %s secs" % (time.time()-load_start)
        print '...done'
    else:
        print 'Invalid parameters', inputfile, ontology_name
        help()
        sys.exit()
