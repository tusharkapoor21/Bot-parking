import cv2

positions = []
x_tlc, y_tlc, x_brc, y_brc = 0, 0, 0, 0
currMouse = {'drawing': 0, 'start': [0, 0], 'end': [0, 0]}


def mClick(event, x, y, *others):
    global positions
    global x_tlc, y_tlc, x_brc, y_brc
    global currMouse
    parking_id = len(positions)
    if event == cv2.EVENT_LBUTTONDOWN:
        x_tlc, y_tlc = x, y
        currMouse['drawing'] = 1
        currMouse['start'] = [x, y]

    elif event == cv2.EVENT_MOUSEMOVE:
        if (currMouse['drawing'] == 0):
            currMouse['start'] = [x, y]
            currMouse['end'] = [x, y]
        else:
            currMouse['end'] = [x, y]

    elif event == cv2.EVENT_LBUTTONUP:
        x_brc, y_brc = x, y
        currMouse['drawing'] = 0
        positions.append(
            {'parking_id': parking_id, 'x_tlc': x_tlc, 'y_tlc': y_tlc, 'x_brc': x_brc, 'y_brc': y_brc})

    elif event == cv2.EVENT_RBUTTONDOWN:
        for i, parking in enumerate(positions):
            x1, y1 = parking['x_tlc'], parking['y_tlc']
            x2, y2 = parking['x_brc'], parking['y_brc']
            if x1 < x < x2 and y1 < y < y2:
                positions.pop(i)


cv2.namedWindow('window1')
k = 0

cv2.setMouseCallback('window1', mClick)
while k != 113:
    img = cv2.imread(
        'D:\DEI\SEMESTER 5\Major project\Bot-parking\images\parking.jpg')
    resizedImg = cv2.resize(
        img, (int(img.shape[1]*0.5), int(img.shape[0]*0.5)))
    cv2.imshow('window1', resizedImg)

    if (len(positions) > 0):
        for pos in positions:
            cv2.rectangle(resizedImg, (pos['x_tlc'], pos['y_tlc']),
                          (pos['x_brc'], pos['y_brc']), (0, 255, 0), 2)
    cv2.rectangle(resizedImg, (currMouse['start']),
                  (currMouse['end']), (0, 0, 255), 2)
    cv2.imshow('window1', resizedImg)
    k = cv2.waitKey(1)

    # below condition is to clear all the parkings
    if (k == 99):
        positions = []

print(positions)
cv2.destroyAllWindows()
