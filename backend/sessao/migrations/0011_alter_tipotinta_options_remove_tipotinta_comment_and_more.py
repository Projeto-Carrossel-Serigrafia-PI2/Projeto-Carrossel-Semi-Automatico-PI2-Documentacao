# Generated by Django 4.0.6 on 2022-07-14 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sessao', '0010_alter_tipotinta_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='tipotinta',
            options={'ordering': ('tipo',)},
        ),
        migrations.RemoveField(
            model_name='tipotinta',
            name='comment',
        ),
        migrations.AddField(
            model_name='tipotinta',
            name='temperaturaPadrao',
            field=models.IntegerField(default=0, verbose_name='Temperatura Padrão RPM'),
        ),
        migrations.AddField(
            model_name='tipotinta',
            name='tipo',
            field=models.TextField(max_length=200, null=True, verbose_name='Tipo Tinta'),
        ),
        migrations.AddField(
            model_name='tipotinta',
            name='velocidadePadrao',
            field=models.IntegerField(default=0, verbose_name='Velocidade Padrão ºC'),
        ),
    ]