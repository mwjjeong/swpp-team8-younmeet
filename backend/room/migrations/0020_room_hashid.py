# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-29 15:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('room', '0019_auto_20171128_1038'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='hashid',
            field=models.CharField(blank=True, max_length=16, null=True),
        ),
    ]
