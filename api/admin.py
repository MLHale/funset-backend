from django.contrib import admin

from api.models import *

# Register models here.
admin.site.register(Term, TermAdmin)
admin.site.register(Gene, GeneAdmin)
admin.site.register(Enrichment, EnrichmentAdmin)
admin.site.register(Run, RunAdmin)
