# @Author: Matthew Hale <mlhale>
# @Date:   2018-02-15T00:14:57-06:00
# @Email:  mlhale@unomaha.edu
# @Filename: models.py
# @Last modified by:   matthale
# @Last modified time: 2019-03-05T23:32:52-06:00
# @License: Funset is a web-based BIOI tool for visualizing genetic pathway information. This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
# @Copyright: Copyright (C) 2017 Matthew L. Hale, Dario Ghersi, Ishwor Thapa



from __future__ import unicode_literals

from django.db import models

from django.contrib import admin

from rest_framework_json_api import serializers

class EagerLoadingMixin:
    @classmethod
    def setup_eager_loading(cls, queryset):
        if hasattr(cls, "_SELECT_RELATED_FIELDS"):
            queryset = queryset.select_related(*cls._SELECT_RELATED_FIELDS)
        if hasattr(cls, "_PREFETCH_RELATED_FIELDS"):
            queryset = queryset.prefetch_related(*cls._PREFETCH_RELATED_FIELDS)
        return queryset

class Ontology(models.Model):
    created = models.DateField()
    name = models.CharField(max_length=1000, blank=False, unique=True)
    description = models.CharField(max_length=1000, blank=True)

    def __str__(self):
        return str(self.name)

    class JSONAPIMeta:
        resource_name = "ontologies"


class OntologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Ontology
        fields = "__all__"

class OntologyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

class Term(models.Model):
    ontology = models.ForeignKey(Ontology, related_name="terms", on_delete=models.CASCADE, blank=False)
    termid = models.CharField(max_length=100, blank=False)
    name = models.CharField(max_length=10000, blank=True)
    namespace = models.CharField(max_length=10000, blank=True)
    description = models.CharField(max_length=10000, blank=True)
    synonym = models.CharField(max_length=1000, blank=True)
    parents = models.ManyToManyField('self', related_name='children', blank=True, symmetrical = False)
    semanticdissimilarityx = models.FloatField(blank=True)
    semanticdissimilarityy = models.FloatField(blank=True)

    def __str__(self):
        return str(self.termid) + ' - ' + str(self.name)

    class JSONAPIMeta:
        resource_name = "terms"


class TermSerializerRelated(serializers.ModelSerializer, EagerLoadingMixin):
    class Meta:
        model = Term
        fields = ("termid","name")

class TermSerializer(serializers.ModelSerializer, EagerLoadingMixin):
    _PREFETCH_RELATED_FIELDS = ['parents', 'children']
    included_serializers = {
        'parents': TermSerializerRelated,
        'children': TermSerializerRelated
    }
    class Meta:
        model = Term
        fields = "__all__"
    class JSONAPIMeta:
        included_resources = ['parents','children']



class TermAdmin(admin.ModelAdmin):
    list_display = ('id', 'termid', 'name')


class Gene(models.Model):
    geneid = models.CharField(max_length=100, blank=False, unique=True)
    name = models.CharField(max_length=10000, blank=True)

    def __str__(self):
        return str(self.geneid)


class GeneSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gene
        fields = "__all__"


class GeneAdmin(admin.ModelAdmin):
    list_display = ('id', 'geneid')


class EnrichmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'term', 'pvalue', 'level')


class Run(models.Model):
    name = models.CharField(max_length=10000, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    ip = models.CharField(max_length=1000, blank=True, default="127.0.0.1")

    def __str__(self):
        return str(self.id) + ' - ' + str(self.ip) +' - ' + str(self.name)+ ' - ' + str(self.created)

    class JSONAPIMeta:
        resource_name = 'runs'

class RunAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created')


class Enrichment(models.Model):
    run = models.ForeignKey(Run, on_delete=models.CASCADE, blank=False, related_name="enrichments")
    term = models.ForeignKey(Term, on_delete=models.CASCADE, blank=False)
    pvalue = models.FloatField(blank=False)
    level = models.FloatField(blank=False)
    semanticdissimilarityx = models.FloatField(blank=True, default=0)
    semanticdissimilarityy = models.FloatField(blank=True, default=0)
    cluster = models.IntegerField(blank=False, default=0)
    medoid = models.BooleanField(blank=True, default=False)
    genes = models.ManyToManyField(Gene, related_name='enrichments', blank=True)

    def __str__(self):
        return str(self.term) + ' - ' + str(self.pvalue) + ' - ' + str(self.level)


class EnrichmentSerializer(serializers.ModelSerializer):
    included_serializers = {
        'genes': GeneSerializer,
        'term': TermSerializer
    }
    class Meta:
        model = Enrichment
        fields = "__all__"

    class JSONAPIMeta:
        resource_name = 'enrichment'
        included_resources = ['genes','term']


class RunSerializer(serializers.ModelSerializer):
    # _PREFETCH_RELATED_FIELDS = ['enrichments']
    enrichments = EnrichmentSerializer(many=True)
    class Meta:
        model = Run
        fields = "__all__"

class RunIncludesSerializer(serializers.ModelSerializer):
    # _PREFETCH_RELATED_FIELDS = ['enrichments']
    included_serializers = {
        'enrichments': EnrichmentSerializer
    }
    enrichments = EnrichmentSerializer(many=True)
    class Meta:
        model = Run
        fields = "__all__"

    class JSONAPIMeta:
        resource_name = 'runs'
        included_resources = ['enrichments']
