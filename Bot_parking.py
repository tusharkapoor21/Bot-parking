import cv2
import pyodbc as dbc
import numpy as np


class Bot_parking:
    def __init__(self) -> None:
        # 1 for availabe, 0 for not available
        # [{'parking_id':parking_id,'status':'NA'/'A', ...}]
        self.status = []

    def getContoursArea(self, cannyImg):
        # finding the contours in the canny image
        contours, hierarchy = cv2.findContours(
            cannyImg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        cannyCopy = cannyImg.copy()
        # drawing those contours on the copy of the canny image of the thickness of 8px
        cv2.drawContours(cannyCopy, contours, -1, (255, 255, 255), 8)
        _, cannyCopyThresh = cv2.threshold(
            cannyCopy, 250, 255, cv2.THRESH_BINARY)
        # finding the area of the contours by calculating the no of white pixels
        area = cv2.countNonZero(cannyCopyThresh)
        return area

    def compare(self, currFrame, positions):
        # this fun should return the statusArray which is an array of dictionaries like
        # [{"tlc":(x,y), "brc":(x,y), "parking_id":parking_id, "status":"NA/A"},{},{},...]
        # here each dictionary represents one parking space
        statusArray = []

        for position in positions:

            parking_id = position[0]
            x_start, y_start = position[1], position[2]
            x_end, y_end = position[3], position[4]
            parkingSpace = currFrame[y_start:y_end, x_start:x_end]
            parkingSpaceBlur = cv2.GaussianBlur(parkingSpace, (5, 5), 0)
            parkingSpaceGray = cv2.cvtColor(
                parkingSpaceBlur, cv2.COLOR_BGR2GRAY)
            # total no of pixels in the image of each parking space
            areaParkingSpace = parkingSpaceGray.shape[0] * \
                parkingSpaceGray.shape[1]
            parkingCanny = cv2.Canny(parkingSpaceGray, 80, 70)
            areaOfCar = self.getContoursArea(parkingCanny)

            areaOfCarPercentage = round((areaOfCar/areaParkingSpace)*100, 2)

            if areaOfCarPercentage > 30:
                # parking not available
                color = (0, 0, 255)  # redcolor
                status = "NA"
                statusArray.append(
                    {"tlc": (x_start, y_start), "brc": (x_end, y_end), "parking_id": parking_id, "status": status})

            else:
                # parking is available
                color = (0, 255, 0)  # greencolor
                status = "A"
                statusArray.append(
                    {"tlc": (x_start, y_start), "brc": (x_end, y_end), "parking_id": parking_id, "status": status})

        return statusArray

    def getPositions(self, org_id):
        # creating the connection to the db
        # this method fetch the positions of all the parking_spaces of
        # the parking lot of org_id
        # this will return an array of tuples of parking_id and positions
        # like [(parking_id, x_tlc,y_tlc,x_brc,y_brc),(...),(...),...]
        cnxn = dbc.connect(
            '''DRIVER={ODBC Driver 17 for SQL Server};\
        Server=localhost\SQLEXPRESS;\
        Database=bot_parking;\
        Trusted_Connection=yes;''')

        # creating the cursor
        cursor = cnxn.cursor()

        # fetching data
        query = f"SELECT * FROM parking_spaces where org_id = {org_id};"
        data = cursor.execute(query).fetchall()
        coordinateArr = []
        for row in data:
            coordinateArr.append((row[0], row[2], row[3], row[4], row[5]))

        cnxn.commit()
        cursor.close()
        cnxn.close()
        return coordinateArr

    def preview(self, source, coordinateArr):
        # previews the the live status of the parking lot
        videoCapObj = cv2.VideoCapture(source)

        success = True
        count = 0
        while success:
            if count % 1 == 0:
                success, frame = videoCapObj.read()
                # resizedFrame = cv2.resize(frame, (900, 636))
                resizedFrame = cv2.resize(
                    frame, (int(frame.shape[1]*0.5), int(frame.shape[0]*0.5)))
                statusArray = self.compare(resizedFrame, coordinateArr)
                count = 0

                for item in statusArray:

                    if item['status'] == 'A':
                        color = (0, 255, 0)  # green

                    else:
                        color = (0, 0, 255)  # red

                    cv2.rectangle(resizedFrame, item['tlc'],
                                  item['brc'], color, 2)

                    cv2.imshow('video', resizedFrame)

                if cv2.waitKey(11) == ord('q'):
                    break
            count += 1

    def updateStatus(self):
        # this function will update the status of all the parkings in the db
        cnxn = dbc.connect(
            '''DRIVER={ODBC Driver 17 for SQL Server};\
        Server=localhost\SQLEXPRESS;\
        Database=bot_parking;\
        Trusted_Connection=yes;''')

        # creating the cursor
        cursor = cnxn.cursor()

        for item in self.status:
            # available condition
            if item['status'] == 'A':
                val = 1
            # not available condition
            else:
                val = 0

            query = f"update parking_spaces set isAvailable = {val} where parking_id = {item['parking_id']};"
            cursor.execute(query)
        cnxn.commit()
        cursor.close()
        cnxn.close()

    def checkStatus(self, source, coordinateArr):
        # this function will run in every 2 mins to check the status of the parking and it will update the value of self.status variable
        print("opening camera")
        videoCapObj = cv2.VideoCapture(source)
        print("camera is opened")

        if (videoCapObj.isOpened()):

            success, frame = videoCapObj.read()
            if success:
                # print(frame.shape)
                resizedFrame = cv2.resize(
                    frame, (int(frame.shape[1]*0.5), int(frame.shape[0]*0.5)))
                statusArray = self.compare(resizedFrame, coordinateArr)

                # item of statusArray looks like
                # {'tlc': (35, 37), 'brc': (159, 239), 'parking_id': 0, 'status': 'A'}
                temp_status_arry = []
                for item in statusArray:
                    temp_status_arry.append(
                        {'parking_id': item['parking_id'], 'status': item['status']})
                self.status = temp_status_arry

        else:
            print("!!Can't open the camera!!")

    @ staticmethod
    def getParkingLots():
        # this function will fetch all the parkings available in the parking_lots table.
        # this method returns an array of all the parking_lots
        # like [(org_name, org_id, parking_add, vid_src),...]
        cnxn = dbc.connect(
            '''DRIVER={ODBC Driver 17 for SQL Server};\
            Server=localhost\SQLEXPRESS;\
            Database=bot_parking;\
            Trusted_Connection=yes;''')
        cursor = cnxn.cursor()
        data = cursor.execute('SELECT * FROM parking_lots;').fetchall()
        cnxn.commit()
        cursor.close()
        cnxn.close()
        return data


rtsp_link = 'rtsp://192.168.1.100:8080/h264_pcm.sdp'
p1 = Bot_parking()
for parking in Bot_parking.getParkingLots():
    # 'parking' is a tuplel like(org_name, org_id, parking_add, vid_src)
    org_id = parking[1]
    positions = p1.getPositions(org_id)
    # p1.preview(rtsp_link, positions)
    # p1.preview(rtsp_link, positions)
    # p1.checkStatus(rtsp_link, positions)
    # p1.updateStatus()
    # print('one round completed')
