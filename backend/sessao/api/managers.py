from math import prod
from django.apps import apps
from django.db import transaction, models


class ProducaoManager(models.Manager):
    def create_from_json(self, data):
        Producao = apps.get_model("sessao", "Producao")
        BaseProducao = apps.get_model("sessao", "BaseProducao")
        print(data)
        lista_base = data.pop("base_producao_create")

        with transaction.atomic():
            
            producao = Producao.objects.create(**data)
            for base in lista_base:
                BaseProducao.objects.create(
                    base=base['base'],
                    cor=base['cor'],
                    producao=producao
                )

        return producao
