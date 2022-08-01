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
	'driedBatchShirts': -1,
	'temperature': 100,
	'inSession': False,
	'waitingNewBatch': False,
	'encoderCounter': 0,
	'motorInUse': False,
}

async def dryShirt():
	paints = state['parameters']['paints']
	currentPaint = paints[state['paint']]['base']

	# flashcureController.start()
	print('Flashcure is on!')
	await asyncio.sleep(currentPaint.tempoSecagem)
	# flashcureController.stop()
	print('Flashcure is off!')

def pedalHandler(channel):
	# if(state['inSession'] and not motorController.isRotating):
	if(state['inSession'] and not state['motorInUse'] and not state['waitingNewBatch']):
		# flashcureController.stop()
		# motorController.start()
		print('Pedal pressed & motor started!')
		state['motorInUse'] = True

def encoderHandler(channel):
	state['encoderCounter'] += 1

	if(state['encoderCounter'] >= MOTOR_STEP):
		# motorController.stop()
		print('Motor stopped!')

		state['rotation'] += 1

		# If the first shirt with the newest color has arrived at the flashcure position
		if(state['rotation'] == CONFIG['FLASHCURE']['POSITION']):
			paints = state['parameters']['paints']
			currentPaint = paints[state['paint']]['base']
			# flashcureController.setTemperature(currentPaint.temperaturaSecagem)
			print('Changed temperature!')

			# Starting counting dried shirts when we start drying the last color of the batch
			if(state['driedBatchShirts'] == -1 and state['paint'] + 1 >= len(state['parameters']['paints'])):
				print('Started counting dried shirts!')
				state['driedBatchShirts'] = 0

		# If a shirt with the newest color has arrived at the flashcure position
		if(state['paint'] > 0 or state['rotation'] >= CONFIG['FLASHCURE']['POSITION']):
			asyncio.run(dryShirt())

		if(state['driedBatchShirts'] != -1):
			state['driedBatchShirts'] += 1
			print(state['driedBatchShirts'], ' shirts dried!')

			if(state['driedBatchShirts'] > state['parameters']['batches'][state['batch']]['shirts']):
				# takePhoto()
				print('Photo taken!')
				print('Batch finished!')
				state['waitingNewBatch'] = True

		# If we completed a full rotation
		if(state['rotation'] > 3):
			state['rotation'] = 0

			if(state['driedBatchShirts'] == -1):
				state['paint'] += 1

		state['encoderCounter'] = 0
		state['motorInUse'] = False

#	GPIO.add_event_detect(CONFIG['PIN']['PEDAL'], GPIO.FALLING, callback=pedalHandler, bouncetime=50)
#	GPIO.add_event_detect(CONFIG['PIN']['ENCODER'], GPIO.RISING, callback=encoderHandler, bouncetime=25)
keyboard.add_hotkey('page down', pedalHandler, args=(3,))
keyboard.add_hotkey('page up', encoderHandler, args=(7,))

def setupProduction():
	production = Producao.objects.last()
	paints = BaseProducao.objects.filter(producao=production)
	batches = Lote.objects.filter(producao=production)

	state['parameters']['paints'] = list(map(lambda x: {'base': x.base, 'cor': x.cor}, paints))
	state['parameters']['batches'] = list(map(lambda x: {'id': x.id, 'shirts': x.quantidadeDeCamisetas}, batches))
	state['parameters']['shirts'] = production.totalDeCamisetas
	state['parameters']['speed'] = production.velocidade

	state['paint'] = 0
	state['batch'] = 0
	state['driedBatchShirts'] = -1
	state['encoderCounter'] = 0
	state['rotation'] = 0
	state['motorInUse'] = False
	state['waitingNewBatch'] = False
	
	state['inSession'] = True

def startProduction():
	paints = state['parameters']['paints']
	currentPaint = paints[state['paint']]['base']
	# motorController.setSpeed(state['parameters']['speed'])
	# flashcureController.setTemperature(currentPaint.temperaturaSecagem)

def startNextBatch():
	state['batch'] += 1

	if(state['batch'] >= len(state['parameters']['batches'])):
		state['inSession'] = False

	else:
		state['paint'] = 0
		state['driedBatchShirts'] = -1
		state['rotation'] = 0
		state['waitingNewBatch'] = False

class ControleProducaoView(APIView):
	def post(self, request):
		action = request.data['action']

		try:
			if(action == 0): # Start
				setupProduction()
				startProduction()

				return Response({'error': False})

			elif(action == 1): # Next batch
				if(not state['inSession']):
					return Response({'error': True, 'description': 'Not in session.'})
				startNextBatch()

			elif(action == 2): # Submit time
				elapsedTime = request.data['elapsedTime']
				if(elapsedTime <= 0):
					return Response({'error': True, 'description': 'Invalid elapsed time given.'})

				production = Producao.objects.last()
				production.tempoDeProducao = elapsedTime
				production.save()

			elif(action == 3): # Request quality analysis
				return Response({'error': True, 'description': 'To be implemented.'})

			return Response({'error': True, 'description': 'Invalid control action.'})

		except Exception as e:
			print(e)
			return Response({'error': True, 'description': 'Internal error.'})

class StateView(APIView):
	def get(self, request):
		return Response({
			'paint': state['paint'],
			'batch': state['batch'],
			'temperature': state['temperature'],
			'waitingNewBatch': state['waitingNewBatch']
			})