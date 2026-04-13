import mysql.connector

conn = mysql.connector.connect(
    host="centerbeam.proxy.rlwy.net",
    user="root",
    password="kJobbDlidqnLkIrzheImKBNqkynImCYM",
    database="railway",
    port=34503
)

cursor = conn.cursor()