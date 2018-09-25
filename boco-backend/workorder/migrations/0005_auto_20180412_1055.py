# Generated by Django 2.0.2 on 2018-04-12 10:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workorder', '0004_auto_20180411_0655'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workordertimeentry',
            name='employee_name',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterUniqueTogether(
            name='workordertimeentry',
            unique_together={('workorder', 'date', 'work_type', 'time_in', 'time_out')},
        ),
    ]