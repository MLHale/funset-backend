import os
import sys
import getopt
import pronto
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pathway_viz_backend.settings")

django.setup()

# your imports, e.g. Django models
from api.models import *

def help():
    print 'Usage: loadterms.py -i <inputfile> \n'
    print 'Parses terms stated in .obo format and loads them into the pathway_viz Datebase using Django\'s ORM.\n'
    print 'Required Arguments:'
    print '\t-i <inputfile>\t\tThe obo file containing the terms to be loaded.\n'
    print 'Optional Arguments:'
    print '\t -h, --help\t\tShow this help message and exit'


if __name__ == '__main__':
    inputfile = ''
    try:
        # Accept options -h and -i
        opts, args = getopt.getopt(sys.argv[1:], "hi:", ["ifile=", ])
    except getopt.GetoptError:
        help()
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            help()
            sys.exit()
        elif opt in ("-i", "--ifile"):
            inputfile = arg

    print 'Loading terms from:', inputfile, 'using Pronto...'
    ont = pronto.Ontology(inputfile)
    print '...done'
    print ont.__len__(), 'Terms Loaded.'
    print 'Adding terms to web app DB...'
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

        newterm = Term( termid=record['id'], name=record['name'],
                        description=record['description'], namespace=record['namespace'], semanticdissimilarityx=0, semanticdissimilarityy=0 )
        newterm.save()
    print '...done'
    print 'Forming many-to-many mapping...'
    for term in ont:
        if term.parents:
            record = Term.objects.get(termid=term.id)
        for parent in term.parents:
            # find parent in Django ORM and link
            parent_record = Term.objects.get(termid=parent.id)
            record.parents.add(parent_record)
    print '...done'
    # print
    # l.name = 'Berlin'
    # l.save()
    #
    # # this is an example to access your model
    # locations = Location.objects.all()
    # print locations
    #
    # # e.g. delete the location
    # berlin = Location.objects.filter(name='Berlin')
    # print berlin
    # berlin.delete()
