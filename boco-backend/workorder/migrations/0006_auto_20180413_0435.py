# Generated by Django 2.0.2 on 2018-04-13 04:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workorder', '0005_auto_20180412_1055'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='bocostock',
            options={'ordering': ['last_modified_at']},
        ),
        migrations.AlterModelOptions(
            name='workorderequipment',
            options={'ordering': ['last_modified_at']},
        ),
        migrations.AlterUniqueTogether(
            name='bocostock',
            unique_together=set(),
        ),
        migrations.AlterUniqueTogether(
            name='workorderequipment',
            unique_together=set(),
        ),
        migrations.AlterUniqueTogether(
            name='workorderequipmentrental',
            unique_together={('workorder', 'equipment_rental', 'ticket_number')},
        ),
        migrations.AlterUniqueTogether(
            name='workordersuppliers',
            unique_together={('workorder', 'supplier', 'ticket_number')},
        ),
    ]
