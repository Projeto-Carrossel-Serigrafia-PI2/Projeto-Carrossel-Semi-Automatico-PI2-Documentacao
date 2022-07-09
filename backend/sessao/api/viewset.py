from rest_framework import viewsets
from sessao.api import serializers
from sessao import models 

class TintaViewSets (viewsets.ModelViewSet):
    serializer_class = serializers.TintaSerializer
    queryset = models.Tinta.objects.all()

class MotorViewSets (viewsets.ModelViewSet):
    serializer_class = serializers.MotorSerializer
    queryset = models.Motor.objects.all()    

class FlashCureViewSets (viewsets.ModelViewSet):
    serializer_class = serializers.FlashCureSerializer
    queryset = models.FlashCure.objects.all()       

class SessaoViewSets (viewsets.ModelViewSet):
    serializer_class = serializers.SessaoSerializer
    queryset = models.Sessao.objects.all()       