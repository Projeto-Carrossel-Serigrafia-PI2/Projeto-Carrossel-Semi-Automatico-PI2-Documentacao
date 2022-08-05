import RPi.GPIO as GPIO

CONFIG = {
    'PIN': {
        'MOTOR': 13,
        'FLASHCURE': 5,
        'PEDAL': 3,
        'ENCODER': 1,
    },
    'FREQUENCY': 1,
    'SPEEDS': [0, 20, 40, 60, 80, 100],
    'ENCODER_HOLES': 20,
}

# Before using an instance, set GPIO mode to BCM
class MotorController:
	def __init__(self, speed, channel=13, speeds=CONFIG['SPEEDS'], frequency=1):	
		GPIO.setup(channel, GPIO.OUT)

		self.isRotating = False
		self.speeds = speeds
		self.speed = speeds[speed]
		self.pwm = GPIO.PWM(channel, frequency)


	def __del__(self):
		self.pwm.stop()

	def start(self):
		self.pwm.start(self.speed)
		self.isRotating = True

	def stop(self):
		self.pwm.stop()
		self.isRotating = False

	def setSpeed(self, speed):
		self.speed = self.speeds[speed]
		self.pwm.ChangeDutyCycle(self.speed)
