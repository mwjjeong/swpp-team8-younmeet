# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-15 20:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_fake',
            field=models.BooleanField(default=False, verbose_name='Is_fake'),
        ),
    ]
