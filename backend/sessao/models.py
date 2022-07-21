import string
from tkinter import CASCADE
from django.db import models
from uuid import uuid4

# Create your models here.

class Base(models.Model) :
   # id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    temperaturaSecagem = models.IntegerField('Temperatura de Secagem °C',default=100)
    tempoSecagem =  models.IntegerField('Tempo de Secagem S',default=30)
    tipo = models.TextField('Tipo da tinta', max_length=200 ,default='outro')
   
class Producao(models.Model):
    #id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    totalDeCamisetas = models.IntegerField('Total de camisetas',default=4)
    date = models.DateTimeField('Data', auto_now=True)
    velocidade = models.IntegerField('velocidade do motor',default=1)
    tempoDeProducao =  models.IntegerField('Tempo de producao',default=30)
    base = models.ManyToManyField(Base,related_name='bases',through="BaseProducao")

class BaseProducao(models.Model):
    #id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    base = models.ForeignKey(Base, related_name="producao_tipoTinta", on_delete=models.CASCADE)
    producao = models.ForeignKey(Producao,related_name="producao_tipoTinta", on_delete=models.CASCADE)
    cor = models.TextField('cor', max_length=200 ,default='branca')
    ordem =  models.IntegerField('ordem',default=1)

class Lote(models.Model):
    #id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    quantidadeDeCamisetas = models.IntegerField('quantidade de camisetas',default=4)
    producao = models.ForeignKey(Producao, on_delete=models.CASCADE)



   

  

