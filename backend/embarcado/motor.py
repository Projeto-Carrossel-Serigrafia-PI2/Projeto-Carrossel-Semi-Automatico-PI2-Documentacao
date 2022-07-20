import RPi.GPIO as GPIO

from carrossel.settings import CONFIG

def RPM2Percentage(rpm, limits):
	if(rpm > limits[1] or rpm < limits[0]):
		raise ValueError("RPM provided is not within the defined limits.")

	# Linear
	return rpm/limits[1]

class MotorController:
	_INSTANCE = None

	@classmethod
	def instance(cls, rpm, channel=CONFIG['PIN']['MOTOR'], limits=CONFIG['LIMITS']['MOTOR'], frequency=CONFIG['FREQUENCY']):
		if cls._INSTANCE is not None:
			cls._INSTANCE.limits = limits
			cls._INSTANCE.setSpeed(rpm)
			return cls._INSTANCE

		return cls(rpm, channel, frequency)

	def __init__(self, rpm, channel=7, limits=CONFIG['LIMITS']['MOTOR'], frequency=1):
		GPIO.setmode(GPIO.BOARD) # Might need to remove from class
		GPIO.setup(channel, GPIO.OUT) # Might need to remove from class

		self.isRotating = False
		self.limits = limits
		self.speed = RPM2Percentage(rpm, limits) * 100
		self.pwm = GPIO.PWM(channel, frequency)

		MotorController._INSTANCE = self

	def __del__(self):
		self.stop()
		GPIO.cleanup() # Might need to remove from class

	def start(self):
		self.pwm.start(self.speed)
		self.isRotating = True

	def stop(self):
		self.pwm.stop()
		self.isRotating = False

	def setSpeed(self, rpm):
		self.speed = RPM2Percentage(rpm, self.limits) * 100
