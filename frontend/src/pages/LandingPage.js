import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(false);

  return (
    <div className="home">
      <div className="left">
        <h1>NextGen Bank 🏦</h1>
        <p>Manage your money easily and securely.</p>

        <button
          className="main-btn"
          onClick={() => setShowCard(true)}
        >
          Get Started
        </button>
      </div>

      <div className="right">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2489/2489756.png"
          alt="bank"
        />
      </div>

      {showCard && (
        <div className="modal">
          <div className="modal-card">
            <h2>Welcome to NextGen Bank 🏦</h2>

            {/* ✅ ACCESS ACCOUNT */}
            <button onClick={() => navigate("/access")}>
              Access Account 🔐
            </button>

            {/* ✅ CREATE ACCOUNT */}
            <button onClick={() => navigate("/create")}>
              Create Account 🆕
            </button>

            <p onClick={() => setShowCard(false)}>
              Close ❌
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;