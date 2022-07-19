import RPi.GPIO as GPIO

def celsius2Percentage(celsius, limits):
	if(celsius > limits[1] or celsius < limits[0]):
		raise ValueError("Temperature provided is not within the defined limits.")

	# Linear
	return celsius/limits[1]

class FlashcureController:
	def __init__(self, celsius, channel=5, frequency=1):
		self.temperature = celsius2Percentage(celsius) * 100

		GPIO.setmode(GPIO.BOARD)
		GPIO.setup(channel, GPIO.OUT)

		self.pwm = GPIO.PWM(channel, frequency)

	def __del__(self):
		self.stop()
		GPIO.cleanup()

	def start(self):
		self.pwm.start(self.temperature)

	def stop(self):
		self.pwm.stop()

	def setSpeed(self, celsius):
		self.temperature = celsius2Percentage(celsius) * 100
