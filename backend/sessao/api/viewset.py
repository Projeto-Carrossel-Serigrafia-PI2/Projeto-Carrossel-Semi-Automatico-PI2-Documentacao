from rest_framework import viewsets, status
from sessao.api import serializers
from sessao import models 
from rest_framework.decorators import action    
from rest_framework.response import Response


class baseViewSets (viewsets.ModelViewSet):
   serializer_class = serializers.BaseSerializer
   queryset = models.Base.objects.all() 

class ProducaoViewSets (viewsets.ModelViewSet):
   serializer_class = serializers.ProducaoSerializer
   queryset = models.Producao.objects.all() 
   
   @action(detail=True, methods=['get'])
   def criaLote (self,request,pk = None):
    Producao = self.get_object()
    if (Producao.totalDeCamisetas % 4 == 0):
        qtLote = Producao.totalDeCamisetas / 4
        qtLote = int(qtLote)
        for x in range(qtLote):
            lote = models.Lote.objects.create(quantidadeDeCamisetas = 4,producao = Producao)
            lote.save
    else : 
        qtLote = Producao.totalDeCamisetas / 4 
        qtLote = int(qtLote)
        for x in range(qtLote):
            lote = models.Lote.objects.create(quantidadeDeCamisetas = 4,producao = Producao)
            lote.save
        qtdCamisaUltimoLote = Producao.totalDeCamisetas % 4
        lote = models.Lote.objects.create(quantidadeDeCamisetas = qtdCamisaUltimoLote ,producao = Producao)
        lote.save
    return Response(status=status.HTTP_200_OK)
class BaseProducaoViewSets (viewsets.ModelViewSet):
    serializer_class = serializers.BaseProducaoSerializer
    queryset = models.Base.objects.all()

