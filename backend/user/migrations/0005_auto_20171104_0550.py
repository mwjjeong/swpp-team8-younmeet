# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-04 05:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_auto_20171104_0517'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
            ],
        ),
        migrations.AlterField(
            model_name='user',
            name='google_account',
            field=models.EmailField(blank=True, default='', max_length=254, verbose_name='google account'),
        ),
    ]
