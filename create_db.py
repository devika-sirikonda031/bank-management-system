import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234"
)

cursor = conn.cursor()

cursor.execute("CREATE DATABASE IF NOT EXISTS bank_db")

cursor.execute("USE bank_db")

cursor.execute("""
CREATE TABLE IF NOT EXISTS accounts(
acc_no INT PRIMARY KEY,
name VARCHAR(50),
balance INT
)
""")

print("Database and table created successfully")

conn.close()