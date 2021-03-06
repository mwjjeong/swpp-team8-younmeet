# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-04 08:30
from __future__ import unicode_literals

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('room', '0002_auto_20171104_0517'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='created_time',
            field=models.DateTimeField(blank=True, default=datetime.datetime.now),
        ),
        migrations.AddField(
            model_name='room',
            name='owner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_room', to=settings.AUTH_USER_MODEL),
        ),
    ]
