from django.apps import apps
from django.db import transaction, models

class ProducaoManager(models.Manager):
    def create_from_json(self, data):
        Producao = apps.get_model("sessao", "Producao")
        BaseProducao = apps.get_model("sessao", "BaseProducao")
        lote = apps.get_model("sessao", "Lote")

        lista_base = data.pop("base_producao_create")

        with transaction.atomic():
            
            producao = Producao.objects.create(**data)
            
            if (producao.totalDeCamisetas % 4 == 0.0):
                qtLote = producao.totalDeCamisetas / 4
                qtLote = int(qtLote)
                for x in range(qtLote):
                    lote.objects.create(quantidadeDeCamisetas = 4,producao = producao)
                    
            else : 
                qtLote = producao.totalDeCamisetas / 4 
                qtLote = int(qtLote)
                for x in range(qtLote):
                    lote.objects.create(quantidadeDeCamisetas = 4,producao = producao)
                    
                qtdCamisaUltimoLote = producao.totalDeCamisetas  % 4 
                lote.objects.create(quantidadeDeCamisetas = qtdCamisaUltimoLote ,producao = producao)
                
            
            for base in lista_base:
                BaseProducao.objects.create(
                    base=base['base'],
                    cor=base['cor'],
                    producao=producao
                )

        return producao
