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

class BaseProducaoViewSets (viewsets.ModelViewSet):
    serializer_class = serializers.BaseProducaoSerializer
    queryset = models.BaseProducao.objects.all()

