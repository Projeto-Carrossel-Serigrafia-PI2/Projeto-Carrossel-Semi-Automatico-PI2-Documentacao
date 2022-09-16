import cv2 as cv
import numpy as np
import os
from sessao.models import Producao
import base64

dirname = os.path.dirname(__file__)
path_photo = os.path.join(dirname, '../assets/')

def take_photo(batch):
  # open a camera for video capturing
  image = cv.VideoCapture(0)

  # return a tuple, first element is bool and second is frame
  ret, frame = image.read()

  # save image
  cv.imwrite(path_photo + 'batches_photos/batch_' + str(batch) + '.jpg', frame) 
  
  # Release the video capture object
  image.release()
  cv.destroyAllWindows()

def cut_shirt_print(image_filename, image_type, r_width, r_height):
  if image_type == 'reference':
    # Reading image
    image = cv.imread(path_photo + 'reference_photo/' + image_filename)
  else:
    # Reading image
    image = cv.imread(path_photo + 'batches_photos/' + image_filename)

    # Dilatation. Close small holes
    kernel = np.ones((3, 3), np.uint8)
    image = cv.morphologyEx(image, cv.MORPH_CLOSE, kernel)

  # Converting to gray scale
  image_gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)

  # Threshold to get just the signature (INVERTED)
  _, thresh_gray = cv.threshold(image_gray, thresh=127, maxval=255, \
                                     type=cv.THRESH_BINARY)
  contours, _ = cv.findContours(thresh_gray,cv.RETR_LIST, \
                                        cv.CHAIN_APPROX_SIMPLE)

  # Dimensions
  dimensions = image.shape
  height = dimensions[0]
  width = dimensions[1]

  data = []
  quantity_rectangles = 0
  for cont in contours:
    x,y,w,h = cv.boundingRect(cont)
    if w < width and w > 4 and h < height and height > 4:
      data.append({ 'initial_x': x, 'initial_y': y, 'w': w, 'h': h })
      quantity_rectangles += 1

  biggest_x = 0
  smallest_x = width * 10
  biggest_y = 0
  smallest_y = height * 10

  for item in data:
    if item['initial_x'] < smallest_x:
      smallest_x = item['initial_x']

    if item['initial_y'] < smallest_y:
      smallest_y = item['initial_y']

    if item['initial_x'] + item['w'] > biggest_x:
      biggest_x = item['initial_x'] + item['w']

    if item['initial_y'] + item['h'] > biggest_y:
      biggest_y = item['initial_y'] + item['h']

  image_cut = image[smallest_y: biggest_y, smallest_x: biggest_x]

  image_reference_width = biggest_x - smallest_x
  image_reference_height = biggest_y - smallest_y

  image_cut = cv.rotate(image_cut, cv.ROTATE_180)
  
  if image_type == 'reference':
    image_cut = cv.resize(
      image_cut,
      (biggest_x - smallest_x,
      biggest_y - smallest_y),
      interpolation=cv.INTER_AREA
    )

    cv.imwrite(path_photo + 'reference_photo/' + image_filename, image_cut)
    with open(path_photo + 'reference_photo/' + image_filename, "rb") as img_file:
      image_batch_b64 = base64.b64encode(img_file.read())
    
    production = Producao.objects.last()
    production.image = image_batch_b64
    production.save()

  else:
    image_cut = cv.resize(
      image_cut,
      (r_width, r_height),
      interpolation=cv.INTER_AREA
    )

    cv.imwrite(path_photo + 'batches_photos/' + image_filename, image_cut)

  return image_reference_width or r_width, image_reference_height or r_height

def analyze_print_format(image_reference_cropped, image_to_analyze_cropped, height, width):
  print('Starting analyze format...')

  similarity = 1 - (cv.norm(image_reference_cropped, image_to_analyze_cropped, cv.NORM_L2) / (height * width))
  final_image = cv.absdiff(image_reference_cropped, image_to_analyze_cropped)

  return str(similarity)

def analyze_failure_matrix(image_to_analyze_cropped, batch):
  print('Starting analyze of matrix...')

  # Dilatation. Close small holes
  kernel = np.ones((3, 3), np.uint8)
  image_closing = cv.morphologyEx(image_to_analyze_cropped, cv.MORPH_CLOSE, kernel)

  # Convert to grayscale
  image_to_analyze_cropped_gray = cv.cvtColor(image_to_analyze_cropped, cv.COLOR_BGR2GRAY)
  image_closing_gray = cv.cvtColor(image_closing, cv.COLOR_BGR2GRAY)

  # Verify similarity between two images
  dimensions = image_to_analyze_cropped.shape
  height = dimensions[0]
  width = dimensions[1]

  # Subtraction of two images
  final_image = cv.absdiff(image_to_analyze_cropped_gray, image_closing_gray)

  # Threshold to get just the signature (INVERTED)
  _, thresh_gray = cv.threshold(final_image, thresh=75, maxval=255, \
                                     type=cv.THRESH_BINARY)

  contours, _ = cv.findContours(thresh_gray,cv.RETR_LIST, \
                                        cv.CHAIN_APPROX_SIMPLE)

  # Draw rectangle around the holes
  quantity_failures = 0
  for cont in contours:
    x,y,w,h = cv.boundingRect(cont)

    if (w < width * (40 / 100)) and (h < height * (40 / 100)):
      if w > 3 and w < 10 and h > 3 and h < 10:
        cv.rectangle(image_to_analyze_cropped, (x,y), (x+w,y+h), (255,0,0), 2)
        quantity_failures += 1

  cv.imwrite(path_photo + 'reports/batch_' + str(batch) + '.jpg', image_to_analyze_cropped)

  return quantity_failures

def analyze_colors(image_reference_cropped, image_to_analyze_cropped):
  # Images must be cropped (image_reference_cropped & image_to_analyze_cropped)
  hsv_image_reference_cropped = cv.cvtColor(image_reference_cropped, cv.COLOR_BGR2HSV)
  hsv_image_to_analyze_cropped = cv.cvtColor(image_to_analyze_cropped, cv.COLOR_BGR2HSV)

  h_bins = 50
  s_bins = 60
  hist_size = [h_bins, s_bins]
  h_ranges = [0, 180]
  s_ranges = [0, 256]
  ranges = h_ranges + s_ranges
  channels = [0, 1]

  hist_image_reference_cropped = cv.calcHist([hsv_image_reference_cropped], channels, None, hist_size, ranges, accumulate=False)
  cv.normalize(hist_image_reference_cropped, hist_image_reference_cropped, alpha=0, beta=1, norm_type=cv.NORM_MINMAX)
  hist_image_to_analyze_cropped = cv.calcHist([hsv_image_to_analyze_cropped], channels, None, hist_size, ranges, accumulate=False)
  cv.normalize(hist_image_to_analyze_cropped, hist_image_to_analyze_cropped, alpha=0, beta=1, norm_type=cv.NORM_MINMAX)

  similarity = cv.compareHist(hist_image_reference_cropped, hist_image_to_analyze_cropped, cv.HISTCMP_CORREL)

  return str(similarity)
