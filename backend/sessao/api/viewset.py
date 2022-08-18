from rest_framework import viewsets
from sessao.api import serializers
from sessao import models

class baseViewSets (viewsets.ModelViewSet):
   serializer_class = serializers.BaseSerializer
   queryset = models.Base.objects.all() 

class ProducaoViewSets (viewsets.ModelViewSet):
   serializer_class = serializers.ProducaoSerializer
   queryset = models.Producao.objects.all() 

class BaseProducaoViewSets (viewsets.ModelViewSet):
    serializer_class = serializers.BaseProducaoSerializer
    queryset = models.BaseProducao.objects.all()

class LoteViewSets (viewsets.ModelViewSet):
   serializer_class = serializers.LoteSerializer
   queryset = models.Lote.objects.all()    
