# Generated by Django 4.1.3 on 2023-05-05 02:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apiData', '0003_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='apicase',
            name='position',
            field=models.IntegerField(default=0, verbose_name='排序优先级'),
        ),
        migrations.AddField(
            model_name='apicasemodule',
            name='position',
            field=models.IntegerField(default=0, verbose_name='排序优先级'),
        ),
    ]