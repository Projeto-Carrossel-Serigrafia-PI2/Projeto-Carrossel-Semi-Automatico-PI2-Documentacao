from rest_framework import viewsets
from sessao.api import serializers
from sessao import models    

class TipoTintaViewSets (viewsets.ModelViewSet):
    serializer_class = serializers.tipoTintaSerializer
    queryset = models.tipoTinta.objects.all() 

class SessaoViewSets (viewsets.ModelViewSet):
    serializer_class = serializers.SessaoSerializer
    queryset = models.Sessao.objects.all()       