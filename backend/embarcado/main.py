import RPi.GPIO as GPIO

def RPM2Percentage(rpm, limits):
	if(rpm > limits.upper OR rpm < limits.lower):
		raise ValueError("RPM provided is not within the defined limits.")

	# Linear
	return rpm/limits.upper

class MotorController:
	def __init__(self, rpm, channel=5, frequency=20):
		self.speed = RPM2Percentage(rpm)

		GPIO.setmode(GPIO.BOARD)
		GPIO.setup(channel, GPIO.OUT)

		self.pwm = GPIO.PWM(channel, frequency)

	def __del__(self):
		self.stop()
		GPIO.cleanup()

	def start(self, rpm):
		self.pwm.start(self.speed)

	def stop(self):
		self.pwm.stop()

	def changeSpeed(self, rpm):
		self.speed = RPM2Percentage(rpm)
		self.pwm.ChangeDutyCycle(self.speed)
