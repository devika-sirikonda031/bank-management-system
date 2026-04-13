import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Transactions.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BASE_URL = "https://bank-management-system-b33i.onrender.com";

function Transactions() {
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id;

  const [transactions, setTransactions] = useState([]);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const pdfRef = useRef();

  const loadTransactions = async () => {
    const res = await fetch(`${BASE_URL}/transactions/${user_id}`);
    const data = await res.json();

    setTransactions(data);

    let deposit = 0;
    let withdraw = 0;

    data.forEach((t) => {
      if (t.type === "deposit") deposit += t.amount;
      else withdraw += t.amount;
    });

    setTotalDeposit(deposit);
    setTotalWithdraw(withdraw);
  };

  useEffect(() => {
    if (user_id) loadTransactions();
  }, [user_id]);

  // 📄 PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save("transactions.pdf");
  };

  // 📌 Pagination logic
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = transactions.slice(indexOfFirst, indexOfLast);

  const nextPage = () => {
    if (indexOfLast < transactions.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="transactions-page">
      <Sidebar />

      <div className="main">

        <div className="header-card">
          <h2>📄 Transactions</h2>
          <p>All your account activity</p>
        </div>

        {/* SUMMARY */}
        <div className="summary-card">
          <h3>Summary</h3>
          <p>Total Deposit: ₹{totalDeposit}</p>
          <p>Total Withdraw: ₹{totalWithdraw}</p>
        </div>

        {/* DOWNLOAD */}
        <button className="download-btn" onClick={downloadPDF}>
          ⬇ Download PDF
        </button>

        {/* TABLE */}
        <div ref={pdfRef}>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((t, i) => (
                <tr key={i}>
                  <td>{t.type}</td>
                  <td>₹{t.amount}</td>
                  <td>₹{t.balance_after}</td>
                  <td>{t.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <button onClick={prevPage}>⬅ Prev</button>
          <span>Page {currentPage}</span>
          <button onClick={nextPage}>Next ➡</button>
        </div>

      </div>
    </div>
  );
}

export default Transactions;