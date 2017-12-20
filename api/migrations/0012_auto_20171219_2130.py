# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-19 21:30
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20171219_2112'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='run',
            name='enrichments',
        ),
        migrations.AddField(
            model_name='enrichment',
            name='run',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='enrichments', to='api.Run'),
            preserve_default=False,
        ),
    ]