# @Author: Matthew Hale <mlhale>
# @Date:   2018-02-15T00:14:57-06:00
# @Email:  mlhale@unomaha.edu
# @Filename: admin.py
# @Last modified by:   mlhale
# @Last modified time: 2018-02-15T00:20:24-06:00
# @License: Funset is a web-based BIOI tool for visualizing genetic pathway information. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
# @Copyright: Copyright (C) 2017 Matthew L. Hale, Dario Ghersi, Ishwor Thapa



from django.contrib import admin

from api.models import *

# Register models here.
admin.site.register(Term, TermAdmin)
admin.site.register(Gene, GeneAdmin)
admin.site.register(Enrichment, EnrichmentAdmin)
admin.site.register(Run, RunAdmin)
