from rest_framework.response import Response
from rest_framework.views import APIView
from sessao.quality_analysis import *
import cv2 as cv
import base64
import os

from carrossel.settings import CONFIG

from sessao.models import Producao, BaseProducao, Lote
from embarcado.motor import MotorController

import asyncio
import keyboard # For debugging

dirname = os.path.dirname(__file__)
path_photo = os.path.join(dirname, '../assets/')

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
	'encoderCounter': 0,
	'lastRotation': -1,
	'inSession': False,
	'motorInUse': False,
	'waitingNewBatch': False,
	'isPaused': False,
	'isRepainting': False
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
	if(state['inSession'] and not state['motorInUse'] and not state['waitingNewBatch'] and not state['isPaused']):
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

		if(not state['isRepainting']):
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
					# Take a photo
					take_photo(state['batch'])

					# Get reference image and convert from base64 to image
					production = Producao.objects.last()
					image_data = base64.b64decode(production.image.split(',')[1])
					image_file = open(path_photo + 'reference_photo/image_reference.jpg', 'wb')
					image_file.write(image_data)
					image_file.close()

					# Cut shirt print
					image_reference_width, image_reference_height = cut_shirt_print('image_reference.jpg', 'reference', 0, 0)
					_, _ = cut_shirt_print('batch_' + str(state['batch']) + '.jpg', 'to_analyze', image_reference_width, image_reference_height)
					
					image_reference_cropped = cv.imread(path_photo + 'reference_photo/image_reference.jpg')
					image_to_analyze_cropped = cv.imread(path_photo + 'batches_photos/batch_' + str(state['batch']) + '.jpg')
					
					# Analysis
					similarity_format = analyze_print_format(image_reference_cropped, image_to_analyze_cropped, image_reference_height, image_reference_width)
					quantity_failures = analyze_failure_matrix(image_to_analyze_cropped, state['batch'])
					similarity_color = analyze_colors(image_reference_cropped, image_to_analyze_cropped)

					# Get current batch
					print('CURRENT BATCH ID: ' + str(state['parameters']['batches'][state['batch']]['id']))
					print('ARRAY OH BATCHES:')
					print(state['parameters']['batches'])
					print('BATCH: ', state['batch'])
					current_batch = Lote.objects.filter(id=state['parameters']['batches'][state['batch']]['id'])[0]

					# convert image to base64
					with open(path_photo + 'batches_photos/batch_' + str(state['batch']) + '.jpg', "rb") as img_file:
						image_batch_b64 = base64.b64encode(img_file.read())

					with open(path_photo + 'reports/batch_' + str(state['batch']) + '.jpg', "rb") as img_file:
						image_batch_report_b64 = base64.b64encode(img_file.read())
					
					# save image and analysis into database

					current_batch.image = image_batch_b64
					current_batch.imageFalhas = image_batch_report_b64
					current_batch.similaridadeFormato = similarity_format
					current_batch.similaridadeCor = similarity_color
					current_batch.quantidadeDeFalhas = quantity_failures
					current_batch.save()
					
					print('Photo taken!')
					print('Batch finished!')
					if(state['batch'] + 1 == len(state['parameters']['batches'])):
						state['inSession'] = False
						print('Production finished!')
					else:
						state['waitingNewBatch'] = True

			# If we completed a full rotation
			if(state['rotation'] > 3):
				state['rotation'] = 0

				if(state['driedBatchShirts'] == -1):
					state['paint'] += 1

		else:
			if(state['rotation'] > 3):
				state['rotation'] = 0

		state['encoderCounter'] = 0
		state['motorInUse'] = False

#	GPIO.add_event_detect(CONFIG['PIN']['PEDAL'], GPIO.FALLING, callback=pedalHandler, bouncetime=50)
#	GPIO.add_event_detect(CONFIG['PIN']['ENCODER'], GPIO.RISING, callback=encoderHandler, bouncetime=25)
keyboard.add_hotkey('page down', pedalHandler, args=(3,))
keyboard.add_hotkey('page up', encoderHandler, args=(7,))

def resetState():
	state['paint'] = 0
	state['batch'] = 0
	state['driedBatchShirts'] = -1
	state['encoderCounter'] = 0
	state['rotation'] = 0
	state['lastRotation'] = -1
	state['waitingNewBatch'] = False
	state['motorInUse'] = False
	state['inSession'] = False
	state['isPaused'] = False
	state['isRepainting'] = False

def setupProduction():
	production = Producao.objects.last()
	paints = BaseProducao.objects.filter(producao=production)
	batches = Lote.objects.filter(producao=production)

	state['parameters']['paints'] = list(map(lambda x: {'base': x.base, 'cor': x.cor}, paints))
	state['parameters']['batches'] = list(map(lambda x: {'id': x.id, 'shirts': x.quantidadeDeCamisetas}, batches))
	state['parameters']['shirts'] = production.totalDeCamisetas
	state['parameters']['speed'] = production.velocidade

	resetState()
	
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
		resetState()
		return

	state['paint'] = 0
	state['driedBatchShirts'] = -1
	state['rotation'] = 0
	state['waitingNewBatch'] = False

def getTemperatures():
	return [112, 30]

def toggleRepainting():
	if(state['isRepainting']):
		state['isRepainting'] = False
		state['lastRotation'] = -1
	else:
		state['isRepainting'] = True
		state['lastRotation'] = state['rotation']

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
					return Response({'error': True, 'type': 1, 'description': 'Not in session.'})
				if(not state['waitingNewBatch']):
					return Response({'error': True, 'type': 2, 'description': 'Not waiting for next batch.'})
				startNextBatch()
				return Response({'error': False})

			elif(action == 2): # Submit time
				elapsedTime = request.data['elapsedTime']
				if(elapsedTime <= 0):
					return Response({'error': True, 'type': 3, 'description': 'Invalid elapsed time given.'})

				production = Producao.objects.last()
				production.tempoDeProducao = elapsedTime
				production.save()

			elif(action == 3): # Request quality analysis
				return Response({'error': True, 'type': 11, 'description': 'To be implemented.'})

			elif(action == 4): # Toggle production
				if(not state['inSession']):
					return Response({'error': True, 'type': 1, 'description': 'Not in session.'})
				if(state['isRepainting']):
					return Response({'error': True, 'type': 6, 'description': 'Repainting in progress.'})
				
				state['isPaused'] = not state['isPaused']

				return Response({'error': False})

			elif(action == 5): # Force production finish
				if(not state['inSession']):
					return Response({'error': True, 'type': 1, 'description': 'Not in session.'})

				resetState()

				return Response({'error': False})

			elif(action == 6): # Repainting
				if(not state['inSession']):
					return Response({'error': True, 'type': 1, 'description': 'Not in session.'})
				if(state['isPaused']):
					return Response({'error': True, 'type': 5, 'description': 'Session is paused.'})
				if(state['isRepainting'] and state['lastRotation'] != state['rotation']):
					return Response({'error': True, 'type': 4, 'description': 'Carousel alignment is not equal to alignment before the repainting started.'})

				toggleRepainting()

				return Response({'error': False})

			return Response({'error': True, 'type': 10, 'description': 'Invalid control action.'})

		except Exception as e:
			print(e)
			return Response({'error': True, 'type': 0, 'description': 'Internal error.'})

class StateView(APIView):
	def get(self, request):
		temperatures = getTemperatures()

		return Response({
			'paint': state['paint'],
			'batch': state['batch'],
			'waitingNewBatch': state['waitingNewBatch'],
			'temperatures': temperatures,
			'inSession': state['inSession'],
			'isPaused': state['isPaused']
		})

class TurnSystemOnView(APIView):
	def post(self, request):
		# do stuff
		return Response({
			'error': False,
			'status': 200
		})
		
class TurnSystemOffView(APIView):
	def post(self, request):
		# do stuff
		return Response({
			'error': False,
			'status': 200
		})
