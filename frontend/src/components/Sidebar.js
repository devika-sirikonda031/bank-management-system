import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>🏦 NextGen Bank</h2>

      <div className="menu">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/graph">Graph</Link>
        <Link to="/">Logout</Link>
      </div>
    </div>
  );
}

export default Sidebar;