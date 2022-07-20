from rest_framework.response import Response
from rest_framework.views import APIView

import functools

import RPi.GPIO as GPIO

from sessao.models import Sessao
from embarcado.motor import MotorController

motorController = None

def cleanCallbacks():
	GPIO.remove_event_detect(3) #Might need to put the channel into config

def pedalHandler(motorController, channel):
	motorController.setSpeed(2)
	motorController.start()

class IniciarSessaoView(APIView):
	inSession = False

	def post(self, request):
		if IniciarSessaoView.inSession is False:
			try:
				session = Sessao.objects.get(pk=request.data["id"])
				motorController = MotorController.instance(session.velocidadeMotor)

				cleanCallbacks()
				GPIO.add_event_detect(3, GPIO.FALLING, callback=functools.partial(pedalHandler, motorController), bouncetime=50)

				IniciarSessaoView.inSession = True

				return Response({"error": False})

			except:
				return Response({"error": True})

		return Response({"error": True, "description": "Already in session."})