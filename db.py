import pyodbc as dbc

cnxn = dbc.connect(
    '''DRIVER={ODBC Driver 17 for SQL Server};\
    Server=localhost\SQLEXPRESS;\
    Database=bot_parking;\
    Trusted_Connection=yes;''')

cursor = cnxn.cursor()
# query = 'INSERT INTO positions (id, x_tlc, y_tlc, x_brc, y_brc, rsvd_for) VALUES (?, ?, ?, ?, ?, ?);'
# for pos in positions:
#     values = [pos['id'], pos['tlc'][0], pos['tlc']
#               [1], pos['brc'][0], pos['brc'][1], "Owner"]
#     # cursor.execute(query, values)


# /////////////NEW/////////////
# it is temporary

# insert data into parking_lots table
# query1 = 'INSERT INTO parking_lots (org_name, org_id, parking_add, vid_src) VALUES (?, ?, ?, ?);'
# values = ["home parking", 1, "on my black board", "system"]
# cursor.execute(query, values)


# cursor.execute('SELECT * FROM parking_lots;')
# cursor.execute('SELECT * FROM positions;')
# data = cursor.fetchall()

# insert data into parking_spaces table
# query2 = 'INSERT INTO parking_spaces (parking_id, org_id, x_tlc, y_tlc, x_brc, y_brc, latitude, longitude, isReserved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);'

# for row in data:
#     values2 = [row[0], 1, row[1], row[2],
#                row[3], row[4], 'not yet', 'not yet', 0]
#     cursor.execute(query2, values2)


cnxn.commit()
cursor.close()
cnxn.close()
