# Generated by Django 4.0.6 on 2022-07-14 12:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sessao', '0008_alter_sessao_tempflashcure_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='tipotinta',
            name='teste',
            field=models.TextField(default='teste', max_length=200, verbose_name='teste'),
        ),
    ]