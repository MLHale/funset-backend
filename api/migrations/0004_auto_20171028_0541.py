# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-10-28 05:41
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20171028_0415'),
    ]

    operations = [
        migrations.RenameField(
            model_name='term',
            old_name='definition',
            new_name='description',
        ),
    ]
