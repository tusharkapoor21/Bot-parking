Bot_parking.py version 1.1

# List of methods

1. getPositions() :

-   this method connects to the db and fetch the positions of the parking spaces or we can say coordinates of parking spaces from the db.
    And returns an array() of tuples of parking_id and positions like[(parking_id, x_tlc,y_tlc,x_brc,y_brc),(...),(...),...]

2. preview(source, coordinateArr) :

-   runs endlessly, stops only when the live stream/video is ended or keyboardInterrupt("q" key in this case) is occured
-   displays live preview of the camera and show the status of parking with green(available parking) or red(not available) rectange over the parking space

3. updateStatus() :

-   this function will insert the values of the self.status variable in the db

4. checkStatus() :

-   we will run this method in every 2 minutes(can be altered as per need)
-   and in every go it will update the value of self.status variable
-   how will it update the value of status variable? -> it will pick up the current frame for the live stream of the CCTV camera and then it will update the self.status variable(it is a dictionary) with parking_id and status

5. getContoursArea(cannyImg) :

-   this is a helper function for compare function, as the name suggests it finds the area covered by the contours of the car and then return that area.

6. compare(currFrame, positions) :

-   this method checks in the current frame that the parking spaces at the given positions are available or not.And returns a statusArray which is an array of dictionaries like [{"tlc":(x,y), "brc":(x,y), "parking_id":parking_id, "status":"NA/A"},{},{},...] in this array each dictionary represents one parking space.

# list of attributes

1. status : this is an array of dictionaries which contains the status of all the parking spaces in the parking lot.

# DATABASE CONFIG

We will make 2 tables in the database

We will make 2 tables in the database

# Parking_lots

We will make 2 tables in the database

1. Parking_lots
   This will have the data about all the parkings that our system is dealing with.
   Fields are : 1. Org_name (varchar(50)) 2. Org_id (int) PRIMARY KEY 3. Parking_add (varchar(150)) 4. Vid_src (varchar(20))

2. Parking_spaces
   This table will contain all the data about all the parking_spaces in all the parking_lots
   Fields are : 1. Org_id (int) FOREIGN KEY NOT NULL 2. Parking_id (int ) PRIMARY KEY 3. X_tlc (int) NOT NULL 4. y_tlc (int) NOT NULL 5. X_brc (int) NOT NULL 6. y_brc (int) NOT NULL 7. latitude (varchar(20)) 8. longitude(varchar(20)) 9. isReserved (BIT) {1:reserved, 0:not reserved} 10. isAvailable (BIT) {1:available, 0:not available}
