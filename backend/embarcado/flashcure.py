import serial

from carrossel.settings import CONFIG

class FlashcureController:
	def __init__(self, limits=CONFIG['FLASHCURE']['LIMITS']):	
		self.uart = serial.Serial('dev/ttyS0', 4800)

		self.limits = limits
		self.temperature = 0
		self.luminosity = 0
		self.height = 0

	def __del__(self):
		self.stop()
		self.uart.close()

	# Maybe there is a better way than setting temperature to 0
	def stop(self):
		self.temperature = 0
		self.luminosity = 0
		self.applyTemperature()

	def __calculateHeightAndLuminosity(self):
		return [0, 30]

	def setTemperature(self, temperature):
		if(temperature > self.limits[1]):
			self.temperature = self.limits[1]
		elif(temperature < self.limits[0]):
			self.temperature = self.limits[0]
		else:
			self.temperature = temperature

		height, luminosity = self.__calculateHeightAndLuminosity()

		self.luminosity = luminosity
		if(height == self.height):
			return None

		self.height = height
		return self.height

	def applyTemperature(self):
		self.uart.write(self.luminosity)
