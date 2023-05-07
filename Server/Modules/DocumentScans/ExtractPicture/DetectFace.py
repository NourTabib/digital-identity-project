import imutils
import sys
import cv2
import uuid

# Get the CLI Arguments
ImagePath = sys.argv[1]

# Prepare Writing Path
outputFile = "./temp/" + str(uuid.uuid4()) + '.jpg'

# Load the cascade
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades +'haarcascade_frontalface_default.xml')

# Read the input image
img = cv2.imread(ImagePath)

# Convert into grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Detect faces
faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2,minNeighbors=5,minSize=(300, 300))

# Extract The Face
for (x, y, w, h) in faces:
    face = img[(y):y + h , (x+100):x + w -100]

# Save the Extracted Face
cv2.imwrite(outputFile ,img=face)

# Send The Output Path to the JS Worker
print(outputFile)