# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-16 08:49
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_auto_20171116_0742'),
    ]

    operations = [
        migrations.AddField(
            model_name='run',
            name='created',
            field=models.DateField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
