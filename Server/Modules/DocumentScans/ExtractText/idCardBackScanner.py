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

OCRLocation = namedtuple("OCRLocation", ["id", "bbox",
	"filter_keywords"])
# define the locations of each area of the document we wish to OCR
OCR_LOCATIONS = [
	OCRLocation("MotherName", (204, 45, 366, 49),
		["middle", "initial", "first", "name"]),
	OCRLocation("Job", (204, 93, 228, 50),
		["last", "name",'انتب']),
	OCRLocation("Adresse", (30, 144,461, 101),
		["address"]),
	OCRLocation("ReleaseDate", (12, 245, 238, 47),
		["city", "zip", "town", "state"]),
]
fileToScan = sys.argv[1]
ScanningTemplate = sys.argv[2]
outputFile = "./temp/" + str(uuid.uuid4()) + '.json'

image = cv2.imread(fileToScan)
template = cv2.imread(ScanningTemplate)
aligned = align_images(image, template)
parsingResults = []
for loc in OCR_LOCATIONS:
	if(loc.id == "idNumber") :
		(x, y, w, h) = loc.bbox
		roi = aligned[y:y + h, x:x + w]
		rgb = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
		text = pytesseract.image_to_string(rgb,lang='eng')
		parsingResults.append((loc, text))
	else:
		(x, y, w, h) = loc.bbox
		roi = aligned[y:y + h, x:x + w]
		rgb = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
		text = pytesseract.image_to_string(rgb,lang='ara',config='--psm 4')
		parsingResults.append((loc, text))
results = {}
for (loc, line) in parsingResults:
	r = results.get(loc.id, None)
	if r is None:
		results[loc.id] = (line, loc._asdict())
	else:
		(existingText, loc) = r
		text = "{}\n{}".format(existingText, line)
		results[loc["id"]] = (text, loc)
parsed = {}
# loop over the results
for (locID, result) in results.items():
	# unpack the result tuple
	(text, loc) = result
	clean = cleanup_text(text)
	parsed[loc["id"]] = clean
with codecs.open(outputFile,'w',"utf-8") as outfile:
	outfile.write(json.dumps(parsed,ensure_ascii = False))
print(outputFile)
