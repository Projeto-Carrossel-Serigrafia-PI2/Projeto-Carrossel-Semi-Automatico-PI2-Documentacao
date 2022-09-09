import serial

from carrossel.settings import CONFIG

class FlashcureController:
	def __init__(self, limits=CONFIG['FLASHCURE']['LIMITS']):	
		self.uart = serial.Serial('/dev/ttyS0', 9600)
		self.uart.timeout = 2

		self.limits = limits
		self.temperature = 0
		self.luminosity = 0

	def __del__(self):
		self.stop()
		self.uart.close()

	def stop(self):
		zero = 0
		self.uart.write(zero.to_bytes(1, 'little'))

	def __calculateLuminosity(self):
		self.luminosity = min(self.temperature, 90)

	def setTemperature(self, temperature):
		if(temperature > self.limits[1]):
			self.temperature = self.limits[1]
		elif(temperature < self.limits[0]):
			self.temperature = self.limits[0]
		else:
			self.temperature = temperature

		self.__calculateLuminosity()

		self.applyTemperature()

	def applyTemperature(self):
		try:
			self.uart.write(self.luminosity.to_bytes(1, 'little'))

			receivedByte = self.uart.read()
			receivedInt = int.from_bytes(receivedByte, 'little')

			if(receivedInt != self.luminosity):
				raise Exception('Number received is not the same as the luminosity sent!')

		except Exception as e:
			print(e)
			raise e
