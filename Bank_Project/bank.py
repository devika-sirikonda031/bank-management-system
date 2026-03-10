from db_connect import connect_db


def create_account():

    conn = connect_db()
    cursor = conn.cursor()

    acc = int(input("Enter account number: "))
    name = input("Enter name: ")
    balance = int(input("Enter opening balance: "))

    sql = "INSERT INTO accounts VALUES (%s,%s,%s)"
    cursor.execute(sql,(acc,name,balance))

    conn.commit()
    print("Account created successfully")

    conn.close()


def deposit():

    conn = connect_db()
    cursor = conn.cursor()

    acc = int(input("Enter account number: "))
    amount = int(input("Enter deposit amount: "))

    sql = "UPDATE accounts SET balance = balance + %s WHERE acc_no=%s"
    cursor.execute(sql,(amount,acc))

    conn.commit()
    print("Money deposited")

    conn.close()


def withdraw():

    conn = connect_db()
    cursor = conn.cursor()

    acc = int(input("Enter account number: "))
    amount = int(input("Enter withdraw amount: "))

    sql = "UPDATE accounts SET balance = balance - %s WHERE acc_no=%s"
    cursor.execute(sql,(amount,acc))

    conn.commit()
    print("Money withdrawn")

    conn.close()


def check_balance():

    conn = connect_db()
    cursor = conn.cursor()

    acc = int(input("Enter account number: "))

    sql = "SELECT balance FROM accounts WHERE acc_no=%s"
    cursor.execute(sql,(acc,))

    result = cursor.fetchone()

    if result:
        print("Balance:", result[0])
    else:
        print("Account not found")

    conn.close()


def show_accounts():

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM accounts")

    rows = cursor.fetchall()

    for r in rows:
        print(r)

    conn.close()