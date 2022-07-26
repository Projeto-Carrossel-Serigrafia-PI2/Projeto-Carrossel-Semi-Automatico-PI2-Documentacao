from rest_framework.response import Response
from rest_framework.views import APIView

# from carrossel.settings import CONFIG

from sessao.models import Producao, Base, BaseProducao, Lote

import asyncio
import keyboard # For debugging
import pprint

CONFIG = {
	'FLASHCURE': {
		'POSITION': 2
	},
	'CAMERA': {
		'POSITION': 3
	},
	'ENCODER_HOLES': 4,
}

MOTOR_STEP = CONFIG['ENCODER_HOLES']/4

# motorController = MotorController.instance(0)
# flashcureController = FlashcureController.instance(0)

PAINTS = list(Base.objects.all())

state = {
	'parameters': {
		'paints': [],
		'batches': [],
		'shirts': 0,
		'speed': 2,
	},
	'paint': 0,
	'rotation': 0,
	'batch': 0,
	'shirt': 0,
	'temperature': 100,
	'inSession': False,
	'encoderCounter': 0,
}

async def dryShirt():
	currentPaint = PAINTS[state['paints'][state['paint']].type]

	# flashcureController.start()
	print('Flashcure is on!')
	await asyncio.sleep(currentPaint.tempoSecagem)
	# flashcureController.stop()
	print('Flashcure is off!')

def pedalHandler(channel):
	if(inSession and is not motorController.isRotating):
		# flashcureController.stop()
		# motorController.start()
		print('Pedal pressed & motor started!')

def encoderHandler(channel):
	state['encoderCounter'] += 1

	if(state['encoderCounter'] >= MOTOR_STEP):
		# motorController.stop()
		print('Motor stopped!')

		state['rotation'] += 1

		# If the first shirt with the newest color has arrived at the flashcure position
		if(state['rotation'] == CONFIG['FLASHCURE']['POSITION']):
			currentPaint = PAINTS[state['paints'][state['paint']].type]
			# flashcureController.setTemperature(currentPaint.temperaturaSecagem)
			print('Changed temperature!')

		# If a shirt with the newest color has arrived at the flashcure position
		if(state['paint'] > 0 or state['rotation'] >= CONFIG['FLASHCURE']['POSITION']):
			asyncio.run(dryShirt())

		# If we completed a full rotation
		if(state['rotation'] > 3):
			state['rotation'] = 0
			state['paint'] += 1

			# If we went through all the paints (doesn't mean they have been dried yet)
			if(state['paint'] >= len(state['parameters']['paints'])):
				state['paint'] = 0
				state['batch'] += 1

				# If we went through all the batches (doesn't mean they have been dried yet)
				if(state['batch'] >= len(state['parameters']['batches'])):
					state['inSession'] = False

		state['encoderCounter'] = 0

#	GPIO.add_event_detect(CONFIG['PIN']['PEDAL'], GPIO.FALLING, callback=pedalHandler, bouncetime=50)
#	GPIO.add_event_detect(CONFIG['PIN']['ENCODER'], GPIO.RISING, callback=encoderHandler, bouncetime=25)
keyboard.add_hotkey('ctrl', pedalHandler, args=(3))
keyboard.add_hotkey('shift', encoderHandler, args=(7))

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
	state['rotation'] = 0
	
	state['inSession'] = True

	#pprint.pprint(production.__dict__)
	#pprint.pprint(len(paints))
	#pprint.pprint(paints[0].__dict__)
	#pprint.pprint(len(batches))

def startProduction():
	currentPaint = PAINTS[state['paints'][state['paint']].type]
	# motorController = MotorController.instance(state['parameters']['speed'])
	# flashcureController = FlashcureController.instance(currentPaint.temperaturaSecagem)

class ControleProducaoView(APIView):
	def post(self, request):
		action = request.data['action'] # 0: Start, 1: Stop, ...
		if(action == 0):
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