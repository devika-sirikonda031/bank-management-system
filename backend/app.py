from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import random
import string

app = Flask(__name__)
CORS(app)

# ==============================
# 🔗 DB CONNECTION (FIXED)
# ==============================
def get_db():
    return mysql.connector.connect(
        host="localhost",   # ✅ FIXED (was loacalhost ❌)
        user="root",
        password="root@123",   # change if needed
        database="bank_db"
    )

# ==============================
# 🔥 GENERATE ACCOUNT NUMBER
# ==============================
def generate_account_number():
    return str(random.randint(1000000000, 9999999999))

# ==============================
# 🔥 GENERATE IFSC
# ==============================
def generate_ifsc():
    letters = ''.join(random.choices(string.ascii_uppercase, k=4))
    numbers = ''.join(random.choices(string.digits, k=6))
    return letters + numbers

# ==============================
# 🟢 CREATE ACCOUNT
# ==============================
@app.route("/create-account", methods=["POST"])
def create_account():
    try:
        data = request.json
        print("CREATE ACCOUNT HIT:", data)  # ✅ debug

        conn = get_db()
        cursor = conn.cursor()

        account_number = generate_account_number()
        ifsc = generate_ifsc()

        query = """
        INSERT INTO accounts 
        (name, email, password, account_number, ifsc, balance, aadhaar, mobile, age, dob)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """

        cursor.execute(query, (
            data["name"],
            data["email"],
            data["password"],
            account_number,
            ifsc,
            0,
            data["aadhaar"],
            data["mobile"],
            data["age"],
            data["dob"]
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "status": "success",
            "account_number": account_number,
            "ifsc": ifsc
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"status": "error", "message": str(e)})

# ==============================
# 🔐 LOGIN
# ==============================
@app.route("/access-account", methods=["POST"])
def access_account():
    try:
        data = request.json

        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM accounts WHERE email=%s AND password=%s",
            (data["email"], data["password"])
        )

        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user:
            return jsonify({"status": "success", "user": user})
        else:
            return jsonify({"status": "error", "message": "Invalid login"})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"status": "error", "message": str(e)})

# ==============================
# 💰 DEPOSIT
# ==============================
@app.route("/deposit", methods=["POST"])
def deposit():
    try:
        data = request.json
        user_id = data["user_id"]
        amount = int(data["amount"])

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE accounts SET balance = balance + %s WHERE id=%s",
            (amount, user_id)
        )
        conn.commit()

        cursor.execute("SELECT balance FROM accounts WHERE id=%s", (user_id,))
        balance = cursor.fetchone()[0]

        cursor.execute(
            "INSERT INTO transactions (user_id, type, amount, balance_after) VALUES (%s,%s,%s,%s)",
            (user_id, "deposit", amount, balance)
        )
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"status": "success", "balance": balance})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"status": "error", "message": str(e)})

# ==============================
# 💸 WITHDRAW
# ==============================
@app.route("/withdraw", methods=["POST"])
def withdraw():
    try:
        data = request.json
        user_id = data["user_id"]
        amount = int(data["amount"])

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("SELECT balance FROM accounts WHERE id=%s", (user_id,))
        balance = cursor.fetchone()[0]

        if balance < amount:
            return jsonify({"status": "error", "message": "Insufficient balance"})

        cursor.execute(
            "UPDATE accounts SET balance = balance - %s WHERE id=%s",
            (amount, user_id)
        )
        conn.commit()

        new_balance = balance - amount

        cursor.execute(
            "INSERT INTO transactions (user_id, type, amount, balance_after) VALUES (%s,%s,%s,%s)",
            (user_id, "withdraw", amount, new_balance)
        )
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"status": "success", "balance": new_balance})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"status": "error", "message": str(e)})

# ==============================
# 📜 TRANSACTIONS
# ==============================
@app.route("/transactions/<int:user_id>", methods=["GET"])
def transactions(user_id):
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM transactions WHERE user_id=%s ORDER BY id DESC",
            (user_id,)
        )

        data = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(data)

    except Exception as e:
        print("ERROR:", e)
        return jsonify([])

# ==============================
# ▶ RUN
# ==============================
if __name__ == "__main__":
    app.run(debug=True)