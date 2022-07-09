import string
from django.db import models
from uuid import uuid4

# Create your models here.

class Motor(models.Model):
    idMotor = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    #velocidadeMinima = models.IntegerField('velocidadeMinima')
    #velocidadeMaxima = models.IntegerField('velocidadeMaxima')
    velocidade = models.IntegerField('velocidade') 
    class Meta:
        ordering = ('velocidade',)
    
    def __str__(self):
        velocidade = str(self.velocidade)
        return velocidade      

class FlashCure(models.Model):
    idFlashcure = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    #temperaturaMinima = models.IntegerField('temperaturaMinima')
    #temperatuMaxima = models.IntegerField('temperatuMaxima')
    tempera = models.IntegerField('temperatura')     
    class Meta:
        ordering = ('tempera',)
    
    def __str__(self):
        tempera = str(self.tempera)
        return tempera   
    

class Tinta(models.Model):
    idTinta = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    tipo = models.CharField(max_length=50)
    cor = models.CharField(max_length=255)
    Motor = models.ForeignKey(Motor, on_delete=models.SET_NULL, null=True)
    FlashCure = models.ForeignKey(FlashCure, on_delete=models.SET_NULL, null=True)

   
    class Meta:
        ordering = ('cor',)

    def __str__(self):
        return self.cor   

class Sessao(models.Model):
    idsessao = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    Tinta = models.ForeignKey(Tinta, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        ordering = ('idsessao',)

    def __str__(self):
        return self.Tinta  

  

