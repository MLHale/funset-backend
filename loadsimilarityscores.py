import os
import sys
import getopt
import csv
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pathway_viz_backend.settings")

django.setup()

# your imports, e.g. Django models
from api.models import *

def help():
    print 'Usage: loadterms.py -i <inputfile> \n'
    print 'Parses text file of format <term> <x> <y> and loads them into the pathway_viz Datebase using Django\'s ORM.\n'
    print 'Required Arguments:'
    print '\t-i <inputfile>\t\tThe text file containing the multidimensional scores for each term.\n'
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

    print 'Updating term records with semantic dissimilarity x,y coordinates:', inputfile, '...'
    with open(inputfile) as tsv:
        for line in csv.reader(tsv, delimiter=' '):
            try:
                record = Term.objects.get(termid=line[0])
                record.semanticdissimilarityx = line[1]
                record.semanticdissimilarityy = line[2]
                record.save()
            except Term.DoesNotExist:
                print 'Error - Term Does not exist:', line
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
