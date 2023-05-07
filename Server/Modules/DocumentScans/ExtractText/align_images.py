from turtle import width
import numpy as np
import imutils
import cv2

def align_images(image,template,maxFeatures=12000,keepPercent=0.2,debug=False):
    image = imutils.resize(image,width = 1000,height = 800)
    imageGray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
    templateGray = cv2.cvtColor(template,cv2.COLOR_BGR2GRAY)
    orb = cv2.ORB_create(maxFeatures)
    (kpsA, descsA) = orb.detectAndCompute(imageGray, None)
    (kpsB, descsB) = orb.detectAndCompute(templateGray, None)
    method = cv2.DESCRIPTOR_MATCHER_BRUTEFORCE_HAMMING
    matcher = cv2.DescriptorMatcher_create(method)
    matches = matcher.match(descsA, descsB, None)
    matches = sorted(matches, key=lambda x:x.distance)
	# keep only the top matches
    keep = int(len(matches) * keepPercent)
    matches = matches[:keep]

    if debug:
        matchedVis = cv2.drawMatches(image, kpsA, template, kpsB,matches, None)
        matchedVis = imutils.resize(matchedVis, width=1000)
        cv2.imshow("Matched Keypoints", matchedVis)
        cv2.waitKey(0)
    ptsA = np.zeros((len(matches), 2), dtype="float")
    ptsB = np.zeros((len(matches), 2), dtype="float")
    for (i, m) in enumerate(matches):
        ptsA[i] = kpsA[m.queryIdx].pt
        ptsB[i] = kpsB[m.trainIdx].pt
    (H, mask) = cv2.findHomography(ptsA, ptsB, method=cv2.RANSAC)
    (h, w) = template.shape[:2]
    aligned = cv2.warpPerspective(image, H, (w, h))
    return aligned

