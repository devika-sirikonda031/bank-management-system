import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Account.css";

function Account() {
  const { id } = useParams();

  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState([]);

  // 🔹 LOAD ACCOUNT (FIXED)
  const loadAccount = () => {
    fetch("http://localhost:5000/accounts")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        // ✅ IMPORTANT FIX: use account_number
        const acc = data.find(
          a => String(a.account_number) === String(id)
        );

        if (!acc) {
          alert("Account not found ❌");
          return;
        }

        setAccount(acc);
      })
      .catch(err => {
        console.error(err);
        alert("Server error ❌");
      });
  };

  useEffect(() => {
    loadAccount();
  }, [id]);

  // 🔹 DEPOSIT (FIXED)
  const deposit = () => {
    if (!amount) return alert("Enter amount");

    fetch(`http://localhost:5000/deposit/${account.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    })
      .then(res => {
        if (!res.ok) throw new Error("Deposit failed");
        return res.json();
      })
      .then(data => {
        alert(data.message);
        setAmount("");
        loadAccount();
      })
      .catch(err => {
        console.error(err);
        alert("Error in deposit ❌");
      });
  };

  // 🔹 WITHDRAW (FIXED)
  const withdraw = () => {
    if (!amount) return alert("Enter amount");

    fetch(`http://localhost:5000/withdraw/${account.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    })
      .then(res => {
        if (!res.ok) throw new Error("Withdraw failed");
        return res.json();
      })
      .then(data => {
        alert(data.message);
        setAmount("");
        loadAccount();
      })
      .catch(err => {
        console.error(err);
        alert("Error in withdraw ❌");
      });
  };

  // 🔹 TRANSACTION HISTORY (FIXED)
  const getHistory = () => {
    fetch(`http://localhost:5000/transactions/${account.id}`)
      .then(res => {
        if (!res.ok) throw new Error("History error");
        return res.json();
      })
      .then(data => setHistory(data))
      .catch(err => {
        console.error(err);
        alert("Error loading history ❌");
      });
  };

  // 🔹 LOADING STATE
  if (!account) return <h2>Loading...</h2>;

  return (
  <div className="layout">
    <Sidebar />

    <div className="account-page">

      <div className="account-container">

        {/* ACCOUNT CARD */}
        <div className="account-card">
          <h2>{account.name}</h2>
          <p className="acc-number">Acc No: {account.account_number}</p>
          <h1 className="balance">₹ {account.balance}</h1>
        </div>

        {/* ACTION BOX */}
        <div className="action-box">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="btn-group">
            <button className="deposit-btn" onClick={deposit}>
              Deposit
            </button>

            <button className="withdraw-btn" onClick={withdraw}>
              Withdraw
            </button>

            <button className="history-btn" onClick={getHistory}>
              History
            </button>
          </div>
        </div>

        {/* HISTORY */}
        <div className="history-box">
          <h3>📜 Transactions</h3>

          {history.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Balance</th>
                </tr>
              </thead>

              <tbody>
                {history.map((t, i) => (
                  <tr key={i}>
                    <td>{new Date(t.created_at).toLocaleString()}</td>
                    <td className={t.type === "deposit" ? "green" : "red"}>
                      {t.type}
                    </td>
                    <td>₹{t.amount}</td>
                    <td>₹{t.balance_after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  </div>
);
}

export default Account;