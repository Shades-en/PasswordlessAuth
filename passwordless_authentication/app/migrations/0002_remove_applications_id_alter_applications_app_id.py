# Generated by Django 4.1.7 on 2023-03-01 10:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="applications",
            name="id",
        ),
        migrations.AlterField(
            model_name="applications",
            name="app_id",
            field=models.CharField(max_length=100, primary_key=True, serialize=False),
        ),
    ]