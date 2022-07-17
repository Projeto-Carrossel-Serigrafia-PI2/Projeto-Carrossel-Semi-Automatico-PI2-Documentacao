import RPi.GPIO as GPIO

def RPM2Percentage(rpm, limits):
	if(rpm > limits[1] or rpm < limits[0]):
		raise ValueError("RPM provided is not within the defined limits.")

	# Linear
	return rpm/limits[1]

class MotorController:
	def __init__(self, rpm, channel=5, frequency=20):
		self.speed = RPM2Percentage(rpm) * 100

		GPIO.setmode(GPIO.BOARD)
		GPIO.setup(channel, GPIO.OUT)

		self.pwm = GPIO.PWM(channel, frequency)

	def __del__(self):
		self.stop()
		GPIO.cleanup()

	def start(self):
		self.pwm.start(self.speed)

	def stop(self):
		self.pwm.stop()

	def setSpeed(self, rpm):
		self.speed = RPM2Percentage(rpm) * 100
