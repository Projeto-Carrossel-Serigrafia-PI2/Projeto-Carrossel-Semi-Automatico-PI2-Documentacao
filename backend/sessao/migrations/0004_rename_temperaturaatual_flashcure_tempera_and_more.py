# Generated by Django 4.0.6 on 2022-07-09 21:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sessao', '0003_sessao'),
    ]

    operations = [
        migrations.RenameField(
            model_name='flashcure',
            old_name='temperaturaAtual',
            new_name='tempera',
        ),
        migrations.RenameField(
            model_name='motor',
            old_name='velocidadeAtual',
            new_name='velocidade',
        ),
        migrations.RemoveField(
            model_name='flashcure',
            name='temperatuMaxima',
        ),
        migrations.RemoveField(
            model_name='flashcure',
            name='temperaturaMinima',
        ),
        migrations.RemoveField(
            model_name='motor',
            name='velocidadeMaxima',
        ),
        migrations.RemoveField(
            model_name='motor',
            name='velocidadeMinima',
        ),
    ]