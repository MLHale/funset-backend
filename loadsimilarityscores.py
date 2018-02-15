# @Author: Matthew Hale <mlhale>
# @Date:   2018-02-14T23:03:27-06:00
# @Email:  mlhale@unomaha.edu
# @Filename: loadsimilarityscores.py
# @Last modified by:   mlhale
# @Last modified time: 2018-02-15T00:21:06-06:00
# @License: Funset is a web-based BIOI tool for visualizing genetic pathway information. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
# @Copyright: Copyright (C) 2017 Matthew L. Hale, Dario Ghersi, Ishwor Thapa



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
