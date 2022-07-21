from rest_framework.response import Response
from rest_framework.views import APIView

from carrossel.settings import CONFIG

import RPi.GPIO as GPIO

from sessao.models import Sessao
from embarcado.motor import MotorController

MOTOR_STEP = CONFIG['ENCODER_HOLES']/4

inSession = False
encoderCounter = 0

motorController = None

def cleanCallbacks():
	GPIO.remove_event_detect(CONFIG['PIN']['PEDAL'])
	GPIO.remove_event_detect(CONFIG['PIN']['ENCODER'])

def pedalHandler(channel):
	if motorController.isRotating is False:
		motorController.start()

def encoderHandler(channel):
	global encoderCounter
	
	encoderCounter += 1

	if(encoderCounter >= MOTOR_STEP):
		motorController.stop()
		encoderCounter = 0

class IniciarSessaoView(APIView):
	def post(self, request):
		global inSession
		global motorController

		if inSession is False:
			try:
				session = Sessao.objects.last()
				motorController = MotorController.instance(session.velocidadeMotor)

				cleanCallbacks()
				GPIO.add_event_detect(CONFIG['PIN']['PEDAL'], GPIO.FALLING, callback=pedalHandler, bouncetime=50)
				GPIO.add_event_detect(CONFIG['PIN']['ENCODER'], GPIO.RISING, callback=encoderHandler, bouncetime=25) # Move to pedalHandler if user can move motor manually

				inSession = True

				return Response({'error': False})

			except:
				return Response({'error': True})

		return Response({'error': True, 'description': 'Already in session.'})