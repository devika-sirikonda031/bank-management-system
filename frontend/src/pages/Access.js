import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Access.css";

const BASE_URL = "https://bank-management-system-b33i.onrender.com";

function Access() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${BASE_URL}/access-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server not working ❌");
    }
  };

  return (
    <div className="access-container">
      <div className="card">
        <h2>Login 🔐</h2>

        <input name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />

        <button onClick={handleSubmit}>Login</button>
      </div>
    </div>
  );
}

export default Access;