# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-04 15:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('room', '0008_auto_20171104_1519'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='created_time',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
