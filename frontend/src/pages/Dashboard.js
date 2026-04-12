import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/DashboardNew.css";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id;

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [displayBalance, setDisplayBalance] = useState(0);

  const loadData = async () => {
    const res = await fetch(`http://127.0.0.1:5000/transactions/${user_id}`);
    const data = await res.json();

    if (data.length > 0) {
      setBalance(data[0].balance_after);
    }
  };

  useEffect(() => {
    if (user_id) loadData();
  }, [user_id]);

  // 💰 Balance animation
  useEffect(() => {
    let start = 0;
    const end = balance;

    const interval = setInterval(() => {
      start += Math.ceil(end / 20);
      if (start >= end) {
        setDisplayBalance(end);
        clearInterval(interval);
      } else {
        setDisplayBalance(start);
      }
    }, 20);
  }, [balance]);

  const deposit = async () => {
    if (!amount || amount <= 0) {
      alert("Enter valid amount ❌");
      return;
    }

    const res = await fetch("http://127.0.0.1:5000/deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_id, amount })
    });

    const data = await res.json();

    if (data.status === "success") {
      alert("Deposit Successful ✅");
      setBalance(data.balance);
      setAmount("");
    }
  };

  const withdraw = async () => {
    if (!amount || amount <= 0) {
      alert("Enter valid amount ❌");
      return;
    }

    const res = await fetch("http://127.0.0.1:5000/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_id, amount })
    });

    const data = await res.json();

    if (data.status === "error") {
      alert(data.message);
    } else {
      alert("Withdraw Successful ✅");
      setBalance(data.balance);
      setAmount("");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">

        {/* HEADER */}
        <div className="header-card">
          <h2>Welcome, {user?.name} 👋</h2>
          <p>Account No: {user?.account_number}</p>
        </div>

        {/* CENTER CARD */}
        <div className="center-card">

          <h4>Current Balance</h4>
          <h1>₹{displayBalance}</h1>

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="btn-group">
            <button className="deposit" onClick={deposit}>
              Deposit
            </button>
            <button className="withdraw" onClick={withdraw}>
              Withdraw
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;