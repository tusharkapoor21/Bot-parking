# imports
import cv2
import pyodbc as dbc

# variables
rtsp_link = 'rtsp://192.168.1.100:8080/h264_pcm.sdp'
positions = []
x_tlc, y_tlc, x_brc, y_brc = 0, 0, 0, 0
currMouse = {'drawing': 0, 'start': [0, 0], 'end': [0, 0]}
cnxnString = '''DRIVER={ODBC Driver 17 for SQL Server};\
    Server=localhost\SQLEXPRESS;\
    Database=bot_parking;\
    Trusted_Connection=yes;'''

# image capturing
print("opening camera to capture image")
camera = cv2.VideoCapture(rtsp_link)
print("camera opened")

check, frame = camera.read()
if (check):
    cv2.imwrite("./images/parking.jpg", frame)
    print('captured')
else:
    print("cant capture the frames")

camera.release()
cv2.destroyAllWindows


# parking selection
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

cv2.destroyAllWindows()

# db operations
cnxn = dbc.connect(cnxnString)
cursor = cnxn.cursor()

# insert data into parking_lots table

# query = 'INSERT INTO parking_lots (org_name, org_id, parking_add, vid_src) VALUES (?, ?, ?, ?);'
# values = ["new parking", 2, "on paper", "IP Camera App"]
# cursor.execute(query, values)

# deleting all the previous positions in parking spaces with org_id = 2

query = 'DELETE FROM parking_spaces WHERE org_id = 2;'
cursor.execute(query)
print('deleted the previous parkings of organisation 2')


# insert data into parking_spaces table

query = 'INSERT INTO parking_spaces (parking_id, org_id, x_tlc, y_tlc, x_brc, y_brc, latitude, longitude, isReserved, isAvailable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?);'

for parking in positions:
    values = [parking['parking_id'], 2, parking['x_tlc'], parking['y_tlc'],
              parking['x_brc'], parking['y_brc'], 'not yet', 'not yet', 0, 1]
    cursor.execute(query, values)
print("saved the new organisations for org_id 2")

cnxn.commit()
cursor.close()
cnxn.close()
