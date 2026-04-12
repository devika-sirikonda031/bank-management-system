import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Transactions.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Transactions() {
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id;

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔄 Load data
  const loadData = async () => {
    const res = await fetch(`http://127.0.0.1:5000/transactions/${user_id}`);
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    if (user_id) loadData();
  }, [user_id]);

  // 🔍 Filter + Search
  const filteredData = transactions.filter((t) => {
    const matchSearch = t.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.type === filter;
    return matchSearch && matchFilter;
  });

  // 📄 Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTransactions = filteredData.slice(indexOfFirst, indexOfLast);

  // 📊 Summary
  const totalDeposit = transactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdraw = transactions
    .filter((t) => t.type === "withdraw")
    .reduce((sum, t) => sum + t.amount, 0);

  // 📥 PDF Download
  const downloadPDF = () => {
    const input = document.querySelector(".transactions-container");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();

      pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
      pdf.save("transactions.pdf");
    });
  };

  return (
    <div className="transactions-page">
      <Sidebar />

      <div className="main">

        {/* HEADER */}
        <div className="header-card">
          <h2>📄 Transactions</h2>
          <p>All your account activity</p>
        </div>

        {/* SUMMARY */}
        <div className="summary-card">
          <h3>📊 Summary</h3>
          <p>Total Deposit: ₹{totalDeposit}</p>
          <p>Total Withdraw: ₹{totalWithdraw}</p>
        </div>

        {/* CONTROLS */}
        <div className="controls">
          <input
            type="text"
            placeholder="Search deposit / withdraw"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
          </select>

          <button className="pdf-btn" onClick={downloadPDF}>
            📥 Download PDF
          </button>
        </div>

        {/* TABLE */}
        <div className="transactions-container">

          <div className="table-header">
            <span>Type</span>
            <span>Amount</span>
            <span>Balance</span>
            <span>Date</span>
          </div>

          {currentTransactions.map((t) => (
            <div className="transaction-row" key={t.id}>
              <span className={t.type === "deposit" ? "green" : "red"}>
                {t.type === "deposit" ? "⬆ Deposit" : "⬇ Withdraw"}
              </span>

              <span>₹{t.amount}</span>
              <span>₹{t.balance_after}</span>

              <span>
                {new Date(t.created_at).toLocaleString()}
              </span>
            </div>
          ))}

        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ⬅ Prev
          </button>

          <span>Page {currentPage}</span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLast >= filteredData.length}
          >
            Next ➡
          </button>
        </div>

      </div>
    </div>
  );
}

export default Transactions;