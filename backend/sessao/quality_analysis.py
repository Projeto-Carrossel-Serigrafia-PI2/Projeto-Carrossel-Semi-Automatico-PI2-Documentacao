import cv2 as cv
import numpy as np

def take_photo():
  # open a camera for video capturing
  image = cv.VideoCapture(0)

  # return a tuple, first element is bool and second is frame
  ret, frame = image.read()

  # display the captured image
  cv.imshow('image', frame)

  # save image
  cv.imwrite('analysis/c1.png',frame) 
  
  # Release the video capture object
  image.release()
  cv.destroyAllWindows()
