import pyodbc as dbc

cnxn = dbc.connect(
    '''DRIVER={ODBC Driver 17 for SQL Server};\
    Server=localhost\SQLEXPRESS;\
    Database=bot_parking;\
    Trusted_Connection=yes;''')

cursor = cnxn.cursor()


# /////////////NEW/////////////
# it is temporary

# insert data into parking_lots table
# query = 'INSERT INTO parking_lots (org_name, org_id, parking_add, vid_src) VALUES (?, ?, ?, ?);'
# values = ["new parking", 2, "on paper", "IP Camera App"]
# cursor.execute(query, values)

# cursor.execute('SELECT * FROM parking_lots;')
# cursor.execute('SELECT * FROM positions;')
# data = cursor.fetchall()

# insert data into parking_spaces table
query = 'INSERT INTO parking_spaces (parking_id, org_id, x_tlc, y_tlc, x_brc, y_brc, latitude, longitude, isReserved, isAvailable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?);'
positions = [{'parking_id': 0, 'x_tlc': 141, 'y_tlc': 35, 'x_brc': 226, 'y_brc': 204}, {'parking_id': 1, 'x_tlc': 245, 'y_tlc': 41, 'x_brc': 325, 'y_brc': 210}, {'parking_id': 2, 'x_tlc': 342, 'y_tlc': 42, 'x_brc': 419, 'y_brc': 210}, {'parking_id': 3, 'x_tlc': 432, 'y_tlc': 39, 'x_brc': 514, 'y_brc': 211}, {'parking_id': 4, 'x_tlc': 527, 'y_tlc': 45, 'x_brc': 614, 'y_brc': 210}, {'parking_id': 5, 'x_tlc': 623, 'y_tlc': 48, 'x_brc': 701, 'y_brc': 224}, {'parking_id': 6, 'x_tlc': 716, 'y_tlc': 48, 'x_brc': 782, 'y_brc': 226}, {
    'parking_id': 7, 'x_tlc': 121, 'y_tlc': 322, 'x_brc': 201, 'y_brc': 515}, {'parking_id': 8, 'x_tlc': 226, 'y_tlc': 324, 'x_brc': 313, 'y_brc': 515}, {'parking_id': 9, 'x_tlc': 328, 'y_tlc': 330, 'x_brc': 402, 'y_brc': 513}, {'parking_id': 10, 'x_tlc': 419, 'y_tlc': 331, 'x_brc': 504, 'y_brc': 519}, {'parking_id': 11, 'x_tlc': 515, 'y_tlc': 339, 'x_brc': 604, 'y_brc': 522}, {'parking_id': 12, 'x_tlc': 615, 'y_tlc': 338, 'x_brc': 688, 'y_brc': 521}, {'parking_id': 13, 'x_tlc': 701, 'y_tlc': 342, 'x_brc': 780, 'y_brc': 534}]
for parking in positions:
    values = [parking['parking_id'], 2, parking['x_tlc'], parking['y_tlc'],
              parking['x_brc'], parking['y_brc'], 'not yet', 'not yet', 0, 1]
    cursor.execute(query, values)


cnxn.commit()
cursor.close()
cnxn.close()
