# Generated by Django 4.0.6 on 2022-07-09 21:10

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('sessao', '0002_flashcure_motor_alter_tinta_options_tinta_flashcure_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Sessao',
            fields=[
                ('idsessao', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('Tinta', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='sessao.tinta')),
            ],
            options={
                'ordering': ('idsessao',),
            },
        ),
    ]