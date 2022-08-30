import RPi.GPIO as GPIO

from carrossel.settings import CONFIG

# Before using an instance, set GPIO mode to BCM
class MotorController:
	def __init__(self, speed, channel=CONFIG['PIN']['MOTOR'], speeds=CONFIG['MOTOR']['SPEEDS'], frequency=CONFIG['MOTOR']['FREQUENCY']):	
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(channel, GPIO.OUT)

		self.isRotating = False
		self.speeds = speeds
		self.speed = speeds[speed]
		self.pwm = GPIO.PWM(channel, frequency)

	def __del__(self):
		self.pwm.stop()
		GPIO.cleanup()

	def start(self):
		self.pwm.start(self.speed)
		self.isRotating = True

	def stop(self):
		self.pwm.stop()
		self.isRotating = False

	def setSpeed(self, speed):
		self.speed = self.speeds[speed]
		self.pwm.ChangeDutyCycle(self.speed)
