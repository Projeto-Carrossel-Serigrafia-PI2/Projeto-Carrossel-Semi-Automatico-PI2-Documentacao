from rest_framework import serializers
from sessao import models 

class BaseSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.Base
    fields = '__all__'   


class ProducaoSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.Producao
    fields = '__all__'       

class BaseProducaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BaseProducao
        fields = '__all__'   
class LoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Lote
        fields = '__all__'           