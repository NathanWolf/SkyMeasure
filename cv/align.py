# From
# https://www.pyimagesearch.com/2015/01/26/multi-scale-template-matching-using-python-opencv/
# See match.py for original script

# USAGE
# python align.py --template template.png --image image

# import the necessary packages
import numpy as np
import argparse
import imutils
import cv2
import json
import sys
import os

# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True, help="Path to the image where template will be matched")
args = vars(ap.parse_args())
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

# load the image image, convert it to grayscale, and detect edges
def loadTemplate(filename):
	template = cv2.imread(os.path.join(__location__, filename))
	template = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)
	template = cv2.Canny(template, 50, 200)
	return template

lanternTemplate = loadTemplate('lantern.png')
hairTemplate = loadTemplate('hair.png')
imagePath = args["image"]

# load the image, convert it to grayscale, and initialize the
# bookkeeping variable to keep track of the matched region
image = cv2.imread(imagePath)
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def match(image, template, scale):
	(tH, tW) = template.shape[:2]
	resized = imutils.resize(image, int(gray.shape[1] * scale))
	r = image.shape[1] / float(resized.shape[1])

	# if the resized image is smaller than the template, then break
	# from the loop
	if resized.shape[0] < tH or resized.shape[1] < tW:
		return None

	# detect edges in the resized, grayscale image and apply template
	# matching to find the template in the image
	edged = cv2.Canny(resized, 50, 200)
	result = cv2.matchTemplate(edged, template, cv2.TM_CCOEFF)
	(_, maxVal, _, maxLoc) = cv2.minMaxLoc(result)

	return (maxVal, maxLoc, r)

def process(image, lanternTemplate, hairTemplate):
	found = None

	(tH, tW) = lanternTemplate.shape[:2]
	# loop over the scales of the image
	# Use broad strokes here to find the general range
	for scale in np.linspace(0.1, 2.1, 50)[::-1]:
		result = match(image, lanternTemplate, scale)
		if result is None:
			break

		# if we have found a new maximum correlation value, then update
		# the bookkeeping variable
		if found is None or result[0] > found[0]:
			found = result

	if found is None:
		results = {'success': False, 'message': 'Could not align images'}
		print(json.dumps(results));
		sys.exit()

	# Now use a tighter loop around the result to narrow in on a scale
	# the first loop steps in 0.004 increments, so we will do 10 steps of 0.01 above and below
	(_, _, broadScale) = found
	for scale in np.linspace(broadScale - 0.002, broadScale + 0.002, 10)[::-1]:
		result = match(image, lanternTemplate, scale)
		if result is None:
			break

		# if we have found a new maximum correlation value, then update
		# the bookkeeping variable
		if result[0] > found[0]:
			found = result

	# unpack the bookkeeping variable and compute the (x, y) coordinates
	# of the bounding box based on the resized ratio
	(correlation, maxLoc, r) = found
	(startX, startY) = (int(maxLoc[0] * r), int(maxLoc[1] * r))
	(endX, endY) = (int((maxLoc[0] + tW) * r), int((maxLoc[1] + tH) * r))

	# Build results
	results = {'success': True}
	results['lantern'] = {
		'left': startX,
		'top': startY,
		'right': endX,
		'bottom': endY,
		'scale': r,
		'correlation': correlation
	}

	# Use the same scale to find the hair
	(tH, tW) = hairTemplate.shape[:2]
	(correlation, maxLoc, _) = match(image, hairTemplate, 1 / r)
	(startX, startY) = (int(maxLoc[0] * r), int(maxLoc[1] * r))
	(endX, endY) = (int((maxLoc[0] + tW) * r), int((maxLoc[1] + tH) * r))

	results['hair'] = {
		'left': startX,
		'top': startY,
		'right': endX,
		'bottom': endY,
		'scale': r,
		'correlation': correlation
	}
	return results

results = process(gray, lanternTemplate, hairTemplate)

# If we found a lantern to the left of the hair, try again!
if (results['success'] and results['hair']['left'] > results['lantern']['right']):
	original = results
	cv2.rectangle(gray, (0, 0), (max(results['hair']['left'] - 32, 0), image.shape[0]), (0, 0 ,0), -1)
	results = process(gray, lanternTemplate, hairTemplate)
	results['original'] = original

print(json.dumps(results))