# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-16 07:42
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20171103_0026'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Experiment',
            new_name='Run',
        ),
    ]