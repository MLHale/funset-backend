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



class Term(models.Model):
    termid = models.CharField(max_length=100, blank=False, unique=True)
    name = models.CharField(max_length=10000, blank=True)
    namespace = models.CharField(max_length=10000, blank=True)
    description = models.CharField(max_length=10000, blank=True)
    synonym = models.CharField(max_length=1000, blank=True)
    parents = models.ManyToManyField('self', related_name='children', blank=True)
    semanticdissimilarityx = models.FloatField(blank=True)
    semanticdissimilarityy = models.FloatField(blank=True)

    def __str__(self):
        return str(self.termid) + ' - ' + str(self.name)

    class JSONAPIMeta:
        resource_name = "terms"

class TermSerializer(serializers.ModelSerializer, EagerLoadingMixin):
    _PREFETCH_RELATED_FIELDS = ['parents']

    class Meta:
        model = Term
        fields = "__all__"


class TermAdmin(admin.ModelAdmin):
    list_display = ('id', 'termid', 'name')


class Gene(models.Model):
    geneid = models.CharField(max_length=100, blank=False)
    name = models.CharField(max_length=10000, blank=True)
    terms = models.ManyToManyField(Term, related_name='genes', blank=True)

    def __str__(self):
        return str(self.geneid) + ' - ' + str(self.name)


class GeneSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gene
        fields = "__all__"


class GeneAdmin(admin.ModelAdmin):
    list_display = ('id', 'geneid')


class Enrichment(models.Model):
    term = models.ForeignKey(Term, on_delete=models.CASCADE, blank=False)
    pvalue = models.FloatField(blank=False)
    level = models.FloatField(blank=False)

    def __str__(self):
        return str(self.term) + ' - ' + str(self.pvalue) + ' - ' + str(self.level)


class EnrichmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Enrichment
        fields = "__all__"


class EnrichmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'term', 'pvalue', 'level')


class Run(models.Model):
    name = models.CharField(max_length=10000, blank=True)
    enrichments = models.ManyToManyField(Enrichment, related_name='enrichments', blank=True)
    created = models.DateField(auto_now_add=True)

    def __str__(self):
        return str(self.id) + ' - ' + str(self.name)+ ' - ' + str(self.created)


class RunSerializer(serializers.ModelSerializer):

    class Meta:
        model = Run
        fields = "__all__"


class RunAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created')
