# @Author: Matthew Hale <mlhale>
# @Date:   2018-02-14T23:03:27-06:00
# @Email:  mlhale@unomaha.edu
# @Filename: loadterms.py
# @Last modified by:   matthale
# @Last modified time: 2019-02-26T14:06:22-06:00
# @License: Funset is a web-based BIOI tool for visualizing genetic pathway information. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
# @Copyright: Copyright (C) 2017 Matthew L. Hale, Dario Ghersi, Ishwor Thapa



import os
import sys
import getopt
import pronto
import django
from django.utils import timezone
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pathway_viz_backend.settings")

django.setup()

# your imports, e.g. Django models
from api.models import *

def help():
    print 'Usage: loadterms.py -i <inputfile> \n'
    print 'Parses terms stated in .obo format and loads them into the pathway_viz Datebase using Django\'s ORM.\n'
    print 'Required Arguments:'
    print '\t-i <inputfile>\t\tThe obo file containing the terms to be loaded.\n'
    print '\t-n <name>\t\tThe directory name where the data is to be stored for the ontology.\n'
    print '\t-d <desc>\t\tA Description of the ontology data.\n'
    print 'Optional Arguments:'
    print '\t -h, --help\t\tShow this help message and exit'


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
        print 'Loading terms from:', inputfile, 'using Pronto...'
        ont = pronto.Ontology(inputfile)
        print '...done'
        print ont.__len__(), 'Terms Loaded.'
        print 'Creating New ontology:', ontology_name
        ontology= Ontology(created=timezone.now(), name=ontology_name, description=ontology_desc)
        ontology.save()
        print '...done'
        print 'Adding terms to',ontology_name,'...'
        for term in ont:
            record = {'id': term.id, 'name': term.name, 'description': term.desc}
            try:
                record['namespace'] = term.other['namespace']
            except AttributeError:
                record['namespace'] = ''

            try:
                record['synonym'] = term.synonyms
            except AttributeError:
                record['synonym'] = ''

            newterm = Term(ontology=ontology, termid=record['id'], name=record['name'],
                            description=record['description'], namespace=record['namespace'], semanticdissimilarityx=0, semanticdissimilarityy=0 )
            newterm.save()
        print '...done'
        print 'Forming many-to-many mapping...'
        for term in ont:
            if term.parents:
                record = Term.objects.get(ontology=ontology, termid=term.id)
                for parent in term.parents:
                    # find parent in Django ORM and link
                    parent_record = Term.objects.get(ontology=ontology, termid=parent.id)
                    record.parents.add(parent_record)
        print '...done'
    else:
        print 'Invalid parameters', inputfile, ontology_name
        help()
        sys.exit()
