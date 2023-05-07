from ast import parse
import json
from pipes import Template
from random import random
from align_images import align_images
from collections import namedtuple
import pytesseract
import argparse
import imutils
import cv2
import sys
from ArabicOcr import arabicocr
from pathlib import Path
import codecs
import uuid

def cleanup_text(text):
	return text.strip('\n')

#ap = argparse.ArgumentParser()
#ap.add_argument("-i", "--image", required=True,
#	help="path to input image that we'll align to template")
#ap.add_argument("-t", "--template", required=True,
#	help="path to input template image")
#args = vars(ap.parse_args())

OCRLocation = namedtuple("OCRLocation", ["id", "bbox",
	"filter_keywords"])
# define the locations of each area of the document we wish to OCR
OCR_LOCATIONS = [
	OCRLocation("idNumber", (260, 130, 220, 40),
		["middle", "initial", "first", "name"]),
	OCRLocation("FamilyName", (260, 180, 380, 52),
		["last", "name",'انتب']),
	OCRLocation("Name", (286, 227,349, 36),
		["address"]),
	OCRLocation("FullName", (286, 263, 395, 36),
		["city", "zip", "town", "state"]),
	OCRLocation("birthdate", (287, 296, 297, 42),
		["employee", "signature", "form", "valid", "unless",
		 	"you", "sign"]),
	OCRLocation("birthplace", (415, 340, 233, 42), ["date"])
]
fileToScan = sys.argv[1]
ScanningTemplate = sys.argv[2]
outputFile = "./temp/" + str(uuid.uuid4()) + '.json'
#print("[INFO] loading images...")
#image = cv2.imread(args["image"])
#template = cv2.imread(args["template"])
image = cv2.imread(fileToScan)
template = cv2.imread(ScanningTemplate)
#print("[INFO] aligning images...")
aligned = align_images(image, template)


#print("[INFO] OCR'ing document...")
parsingResults = []




# loop over the locations of the document we are going to OCR
for loc in OCR_LOCATIONS:
	# extract the OCR ROI from the aligned image
	if(loc.id == "idNumber") :
		(x, y, w, h) = loc.bbox
		roi = aligned[y:y + h, x:x + w]
		# OCR the ROI using Tesseract
		rgb = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
		text = pytesseract.image_to_string(rgb,lang='eng')
		parsingResults.append((loc, text))
	else:
		(x, y, w, h) = loc.bbox
		roi = aligned[y:y + h, x:x + w]
		# OCR the ROI using Tesseract
		rgb = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
		text = pytesseract.image_to_string(rgb,lang='ara',config='--psm 4')
		parsingResults.append((loc, text))
results = {}
# loop over the results of parsing the document
for (loc, line) in parsingResults:
	# grab any existing OCR result for the current ID of the document
	r = results.get(loc.id, None)
	# if the result is None, initialize it using the text and location
	# namedtuple (converting it to a dictionary as namedtuples are not
	# hashable)
	if r is None:
		results[loc.id] = (line, loc._asdict())
	# otherwise, there exists an OCR result for the current area of the
	# document, so we should append our existing line
	else:
		# unpack the existing OCR result and append the line to the
		# existing text
		(existingText, loc) = r
		text = "{}\n{}".format(existingText, line)
		# update our results dictionary
		results[loc["id"]] = (text, loc)
parsed = {}
# loop over the results
for (locID, result) in results.items():
	# unpack the result tuple
	(text, loc) = result
	
	# display the OCR result to our terminal
	#print(loc["id"])
	#print("=" * len(loc["id"]))
	#print("{}\n\n".format(text))
	# extract the bounding box coordinates of the OCR location and
	# then strip out non-ASCII text so we can draw the text on the
	# output image using OpenCV
	#(x, y, w, h) = loc["bbox"]
	clean = cleanup_text(text)
	parsed[loc["id"]] = clean
	# draw a bounding box around the text
	#cv2.rectangle(aligned, (x, y), (x + w, y + h), (0, 255, 0), 2)
	# loop over all lines in the text
	#for (i, line) in enumerate(text.split("\n")):
		# draw the line on the output image
	#	startY = y + (i * 70) + 40
	#	cv2.putText(aligned, line, (x, startY),
	#	cv2.FONT_HERSHEY_SIMPLEX, 1.8, (0, 0, 255), 5)
with codecs.open(outputFile,'w',"utf-8") as outfile:
	outfile.write(json.dumps(parsed,ensure_ascii = False))
#print(json.dumps(parsed,ensure_ascii = False))
#cv2.imshow("Input", imutils.resize(image, width=700))
#cv2.imshow("Output", imutils.resize(aligned, width=700))
#cv2.waitKey(0)
print(outputFile)