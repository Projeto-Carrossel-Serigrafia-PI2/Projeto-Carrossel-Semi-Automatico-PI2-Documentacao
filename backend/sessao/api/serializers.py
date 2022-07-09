from rest_framework import serializers
from sessao import models 

class TintaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tinta
        fields = '__all__'
class MotorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Motor
        fields = '__all__'

class FlashCureSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FlashCure
        fields = '__all__'
class SessaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Sessao
        fields = '__all__'        