import pickle
import cv2

try:
    with open('parkingPos', 'rb') as f:
        parkPos = pickle.load(f)

except:
    parkPos = {'top_left_corner':[],
            'bottom_right_corner':[],
            'count':0}

def mClick(event, x, y, *others):
    if event == cv2.EVENT_LBUTTONDOWN:
        # top_left_corner = [(x,y)]
        parkPos['top_left_corner'].append((x,y))

    elif event == cv2.EVENT_LBUTTONUP:
        # bottom_right_corner = [(x,y)]
        parkPos['bottom_right_corner'].append((x,y))
        parkPos['count'] += 1

    elif event == cv2.EVENT_RBUTTONDOWN:
        for i,pos in enumerate(parkPos['top_left_corner']):
            x1,y1 = pos
            x2 ,y2 = parkPos['bottom_right_corner'][i][0], parkPos['bottom_right_corner'][i][1]
            if x1 < x < x2 and y1 < y < y2:
                parkPos['top_left_corner'].pop(i)    
                parkPos['bottom_right_corner'].pop(i)
                parkPos['count'] -=1
    with open('parkingPos', 'wb') as f:
        pickle.dump(parkPos, f)
    

cv2.namedWindow('window1')

k=0
cv2.setMouseCallback('window1', mClick)
while k != 113:
    img = cv2.imread('pic.jpg')
    copyImg = img.copy()
    cv2.imshow('window1', img)
    for pt in range(parkPos['count']):
        cv2.rectangle(img, parkPos['top_left_corner'][pt], parkPos['bottom_right_corner'][pt], (0,255,0),2)
        cv2.imshow('window1', img)
    k = cv2.waitKey(1)
    if (k == 99):
        parkPos['top_left_corner']=[]
        parkPos['bottom_right_corner']=[]
        parkPos['count']=0
        
cv2.destroyAllWindows()