import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Graph.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

import html2canvas from "html2canvas";

function Graph() {
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id;

  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");

  // 🔥 FETCH DATA
  const loadData = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/transactions/${user_id}`);
      const data = await res.json();
      setTransactions(data.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user_id) loadData();
  }, [user_id]);

  // 🔥 FILTER LOGIC
  const filteredData = transactions.filter((t) => {
    if (filter === "all") return true;

    const date = new Date(t.created_at);
    const now = new Date();

    if (filter === "today") {
      return date.toDateString() === now.toDateString();
    }

    if (filter === "week") {
      const diff = (now - date) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }

    if (filter === "month") {
      return date.getMonth() === now.getMonth();
    }

    return true;
  });

  // 🔥 TOTALS
  const totalDeposit = filteredData
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdraw = filteredData
    .filter((t) => t.type === "withdraw")
    .reduce((sum, t) => sum + t.amount, 0);

  const pieData = [
    { name: "Deposit", value: totalDeposit },
    { name: "Withdraw", value: totalWithdraw }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  // 📥 DOWNLOAD GRAPH
  const downloadGraph = () => {
    const element = document.getElementById("graph-area");

    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.download = "graph.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">

        {/* HEADER */}
        <div className="header-card">
          <h2>📊 Analytics Dashboard</h2>
          <p>Track your financial activity</p>
        </div>

        {/* 🔥 FILTER BUTTONS */}
        <div className="filter-buttons">

          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={filter === "today" ? "active" : ""}
            onClick={() => setFilter("today")}
          >
            Today
          </button>

          <button
            className={filter === "week" ? "active" : ""}
            onClick={() => setFilter("week")}
          >
            Week
          </button>

          <button
            className={filter === "month" ? "active" : ""}
            onClick={() => setFilter("month")}
          >
            Month
          </button>

          <button className="download-btn" onClick={downloadGraph}>
            📥 Download
          </button>

        </div>

        {/* GRAPH AREA */}
        <div id="graph-area">

          <div className="dashboard-grid">

            {/* LINE CHART */}
            <div className="dashboard-card">
              <h3>Balance Growth</h3>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData}>

                  <defs>
                    <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>

                  <XAxis dataKey="created_at" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />

                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="balance_after"
                    stroke="url(#colorLine)"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* PIE CHART */}
            <div className="dashboard-card">
              <h3>Deposit vs Withdraw</h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* BAR CHART */}
            <div className="dashboard-card">
              <h3>Deposit vs Withdraw (Bar)</h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pieData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[10,10,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Graph;