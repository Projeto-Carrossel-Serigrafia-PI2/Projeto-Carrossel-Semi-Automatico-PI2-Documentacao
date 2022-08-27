from rest_framework import serializers
from sessao import models 

class BaseSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.Base
    fields = '__all__'   

class BaseProducaoSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.BaseProducao
        fields = '__all__'   

class BaseProducaoCreatorSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.BaseProducao
        fields = ('base', 'cor')

class ProducaoSerializer(serializers.ModelSerializer):
    base_producao_create = BaseProducaoCreatorSerializer(many=True, write_only=True)
    base_producao_get = BaseProducaoSerializer(many=True, read_only=True, source="baseproducao_set")
  
    class Meta:
        model = models.Producao
        fields = ( 
            "totalDeCamisetas",
            "velocidade",
            "base_producao_create",
            "base_producao_get",
            "image"
        )

    def create(self, validated_data):
        producao = models.Producao.objects.create_from_json(validated_data)
        return producao

class LoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Lote
        fields = '__all__'           
