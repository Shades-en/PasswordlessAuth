# Generated by Django 4.1.7 on 2023-03-01 10:57

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0002_remove_applications_id_alter_applications_app_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="applications",
            name="created_at",
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]
