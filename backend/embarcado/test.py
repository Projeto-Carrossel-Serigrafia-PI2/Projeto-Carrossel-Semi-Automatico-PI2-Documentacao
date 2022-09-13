import time

import RPi.GPIO as GPIO
import motor

GPIO.setmode(GPIO.BCM)

controller = motor.MotorController(2)
controller.start()

time.sleep(5)

controller.setSpeed(5)

time.sleep(5)

controller.stop()
GPIO.cleanup()
