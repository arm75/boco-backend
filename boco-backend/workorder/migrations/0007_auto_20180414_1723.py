# Generated by Django 2.0.2 on 2018-04-14 17:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workorder', '0006_auto_20180413_0435'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='workorderequipmentrental',
            options={'ordering': ['last_modified_at']},
        ),
        migrations.AlterModelOptions(
            name='workordersuppliers',
            options={'ordering': ['last_modified_at']},
        ),
        migrations.AlterModelOptions(
            name='workordertimeentry',
            options={'ordering': ['last_modified_at']},
        ),
        migrations.AlterUniqueTogether(
            name='workorderequipmentrental',
            unique_together=set(),
        ),
        migrations.AlterUniqueTogether(
            name='workordersuppliers',
            unique_together=set(),
        ),
        migrations.AlterUniqueTogether(
            name='workordertimeentry',
            unique_together=set(),
        ),
    ]
