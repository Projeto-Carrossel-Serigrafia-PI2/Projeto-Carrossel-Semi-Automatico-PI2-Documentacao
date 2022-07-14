from rest_framework import serializers
from sessao import models 

class tipoTintaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.tipoTinta
        fields = '__all__'   

class SessaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Sessao
        fields = '__all__'        