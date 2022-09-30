import cv2, pickle
import numpy as np

# opening the pickle file containing the positions of parking space
try:
    with open('parkingPos', 'rb') as f:
        parkPos = pickle.load(f)
except:
    print('file does not exist!')

img = cv2.imread('pic.jpg')
copyimg = img.copy()

def checkIfEmpty():
    grayscale = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    gausianblur = cv2.GaussianBlur(grayscale,(1,1),cv2.BORDER_DEFAULT)
    medianBlur = cv2.medianBlur(gausianblur, 3)
    canny = cv2.Canny(medianBlur,100,250)
    
    for pt in range(parkPos['count']):
        x_start, y_start = parkPos['top_left_corner'][pt][0], parkPos['top_left_corner'][pt][1]
        x_end, y_end = parkPos['bottom_right_corner'][pt][0], parkPos['bottom_right_corner'][pt][1]
        cropImg = canny[y_start:y_end, x_start:x_end]

        if(cv2.countNonZero(cropImg) > 120):
            color = (0,0,255)
            status='NP'
        else: 
            color = (0,255,0)
            status='P'

        cv2.rectangle(copyimg, parkPos['top_left_corner'][pt], parkPos['bottom_right_corner'][pt], color,2)
        cv2.putText(copyimg, status,(x_start+10, y_start-10),cv2.FONT_HERSHEY_COMPLEX,0.6,(255,0,0),2)
        cv2.imshow('original', copyimg)
    

k=0
while k != 113:
    checkIfEmpty()
    k = cv2.waitKey(1)