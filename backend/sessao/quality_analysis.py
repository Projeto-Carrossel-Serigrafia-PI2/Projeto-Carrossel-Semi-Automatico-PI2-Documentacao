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

def cut_shirt_print(image_filename, image_type, r_width, r_height):
  # Reading image
  image = cv.imread('./data_files/' + image_filename)

  if image_type == 'to_analyze':
    # Dilatation. Close small holes
    kernel = np.ones((3, 3), np.uint8)
    image = cv.morphologyEx(image, cv.MORPH_CLOSE, kernel)

  # Converting to gray scale
  image_gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)

  # Threshold to get just the signature (INVERTED)
  retval, thresh_gray = cv.threshold(image_gray, thresh=100, maxval=255, \
                                  type=cv.THRESH_BINARY_INV)
  contours, hierarchy = cv.findContours(thresh_gray,cv.RETR_LIST, \
                                      cv.CHAIN_APPROX_SIMPLE)

  # Dimensions
  dimensions = image.shape
  height = dimensions[0]
  width = dimensions[1]

  data = []
  quantity_rectangles = 0
  for cont in contours:
      x,y,w,h = cv.boundingRect(cont)
      if w < width and h < height:
        data.append({ 'initial_x': x, 'initial_y': y, 'final_x': w, 'final_y': h })
        quantity_rectangles += 1

  biggest_x = 0
  smallest_x = width * 2
  biggest_y = 0
  smallest_y = height * 2
  index = 0
  index_x = 0
  index_y = 0

  for item in data:
    if item['initial_x'] < smallest_x:
      smallest_x = item['initial_x']

    if item['initial_y'] < smallest_y:
      smallest_y = item['initial_y']

    if item['final_x'] > biggest_x:
      biggest_x = item['final_x']
      index_x = index

    if item['final_y'] > biggest_y:
      biggest_y = item['final_y']
      index_y = index
    
    index += 1

  cv.rectangle(
    image,
    (smallest_x, smallest_y),
    (data[index_x]['initial_x'] + data[index_x]['final_x'], data[index_y]['initial_y'] + data[index_y]['final_y']),
    (255,0,0),
    2
  )

  image_cut = image[
    smallest_y: data[index_y]['initial_y'] + data[index_y]['final_y'],
    smallest_x: data[index_x]['initial_x'] + data[index_x]['final_x']] 

  image_reference_width = data[index_x]['initial_x'] + data[index_x]['final_x'] - smallest_x
  image_reference_height = data[index_y]['initial_y'] + data[index_y]['final_y'] - smallest_y
  
  if image_type == 'reference':
    image_cut = cv.resize(
      image_cut,
      (data[index_x]['initial_x'] + data[index_x]['final_x'] - smallest_x,
      data[index_y]['initial_y'] + data[index_y]['final_y'] - smallest_y),
      interpolation=cv.INTER_AREA
    )

    cv.imwrite('./cropped/reference.jpg', image_cut)
  else:
    image_cut = cv.resize(
      image_cut,
      (r_width, r_height),
      interpolation=cv.INTER_AREA
    )

    cv.imwrite('./cropped/to_analyze.jpg', image_cut)

  return image_reference_width or r_width, image_reference_height or r_height
