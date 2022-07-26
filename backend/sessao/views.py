from rest_framework.response import Response
from rest_framework.views import APIView

#from carrossel.settings import CONFIG

from sessao.models import Producao, Base, BaseProducao, Lote

import pprint

#MOTOR_STEP = CONFIG['ENCODER_HOLES']/4

#motorController = None

PAINTS = list(Base.objects.all())

state = {
	'parameters': {
		'paints': [],
		'batches': [],
		'shirts': 0,
		'speed': 2,
	},
	'paint': 0,
	'batch': 0,
	'shirt': 0,
	'temperature': 100,
	'inSession': False,
	'encoderCounter': 0,
}

# def cleanCallbacks():
# 	GPIO.remove_event_detect(CONFIG['PIN']['PEDAL'])
# 	GPIO.remove_event_detect(CONFIG['PIN']['ENCODER'])

# def pedalHandler(channel):
# 	if motorController.isRotating is False:
# 		motorController.start()

# def encoderHandler(channel):
# 	global encoderCounter

# 	encoderCounter += 1

# 	if(encoderCounter >= MOTOR_STEP):
# 		motorController.stop()
# 		encoderCounter = 0

def setupProduction():
	production = Producao.objects.last()
	paints = BaseProducao.objects.filter(producao=production)
	batches = Lote.objects.filter(producao=production)

	state['parameters']['paints'] = list(map(lambda x: {'type': x.base, 'cor': x.cor}, paints))
	state['parameters']['batches'] = list(map(lambda x: {'id': x.id, 'shirts': x.quantidadeDeCamisetas}, batches))
	state['parameters']['shirts'] = production.totalDeCamisetas
	state['parameters']['speed'] = production.velocidade

	state['paint'] = 0
	state['batch'] = 0
	state['shirt'] = 0
	state['encoderCounter'] = 0
	
	state['inSession'] = True

	#pprint.pprint(production.__dict__)
	#pprint.pprint(len(paints))
	#pprint.pprint(paints[0].__dict__)
	#pprint.pprint(len(batches))

def startProduction():
	pass

class ControleProducaoView(APIView):
	def post(self, request):
		action = request.data['action'] # 0: Start, 1: Stop, ...
		if action == 0:
			setupProduction()
			startProduction()

			return Response({'error': False})

			#if inSession is False:
			#	try:
			#		session = Sessao.objects.last()
			#		motorController = MotorController.instance(session.velocidadeMotor)
			#
			#		cleanCallbacks()
			#		GPIO.add_event_detect(CONFIG['PIN']['PEDAL'], GPIO.FALLING, callback=pedalHandler, bouncetime=50)
			#		GPIO.add_event_detect(CONFIG['PIN']['ENCODER'], GPIO.RISING, callback=encoderHandler, bouncetime=25) # Move to pedalHandler if user can move motor manually
			#
			#		inSession = True
			#
			#		return Response({'error': False})
			#
			#	except:
			#		return Response({'error': True})
			#
			#return Response({'error': True, 'description': 'Already in session.'})

		return Response({'error': True, 'description': 'Invalid control action.'})