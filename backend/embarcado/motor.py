import RPi.GPIO as GPIO

def RPM2Percentage(rpm, limits):
	if(rpm > limits[1] or rpm < limits[0]):
		raise ValueError("RPM provided is not within the defined limits.")

	# Linear
	return rpm/limits[1]

class MotorController:
	_INSTANCE = None

	@classmethod
	def instance(cls, rpm, channel=7, frequency=1):
		if cls._INSTANCE is not None:
			cls._INSTANCE.setSpeed(rpm)
			return cls._INSTANCE

		return cls(rpm, channel, frequency)


	def __init__(self, rpm, channel=7, frequency=1):
		self.speed = RPM2Percentage(rpm) * 100

		GPIO.setmode(GPIO.BOARD)
		GPIO.setup(channel, GPIO.OUT)

		self.pwm = GPIO.PWM(channel, frequency)

		MotorController._INSTANCE = self

	def __del__(self):
		self.stop()
		GPIO.cleanup()

	def start(self):
		self.pwm.start(self.speed)

	def stop(self):
		self.pwm.stop()

	def setSpeed(self, rpm):
		self.speed = RPM2Percentage(rpm) * 100
