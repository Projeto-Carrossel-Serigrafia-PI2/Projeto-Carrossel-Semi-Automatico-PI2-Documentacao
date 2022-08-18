"""carrossel URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path , include 

from rest_framework import routers
from sessao.api import viewset as SessaoViewSets
from sessao.views import ControleProducaoView, StateView

route = routers.DefaultRouter()

route.register(r'base', SessaoViewSets.baseViewSets, basename='base')
route.register(r'producao', SessaoViewSets.ProducaoViewSets, basename='producao')
route.register(r'baseProducao', SessaoViewSets.BaseProducaoViewSets,basename='baseProducao')
route.register(r'lote', SessaoViewSets.LoteViewSets,basename='lote')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('controleProducao/', ControleProducaoView.as_view()),
    path('estado/', StateView.as_view()),
    path('', include(route.urls))
]
