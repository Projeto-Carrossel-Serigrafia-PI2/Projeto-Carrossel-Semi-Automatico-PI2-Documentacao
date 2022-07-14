import string
from django.db import models
from uuid import uuid4

# Create your models here.

class tipoTinta(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    tipo = models.TextField('Tipo Tinta', max_length=200 ,null=True)
    velocidadePadrao =  models.IntegerField('Velocidade Padrão RMP', default=0)
    temperaturaPadrao = models.IntegerField('Temperatura Padrão ºC', default=0)
    class Meta:
        ordering = ('tipo',)
    
    def __str__(self):
     return self.tipo       

class Sessao(models.Model):
    idsessao = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    tipoTinta = models.ForeignKey(tipoTinta, on_delete=models.SET_NULL, null=True)
    quantidadeTinta = models.IntegerField('Quantidade Tinta ºC.', default=0)
    TempFlashCure =  models.IntegerField('Temperatura ºC.', default=0)
    velocidadeMotor = models.IntegerField('Velocidade RPM',default=0) 
    class Meta:
        ordering = ('idsessao',)

    def __str__(self):
        return self.tipoTinta  

  

