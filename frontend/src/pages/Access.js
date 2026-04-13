import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Access.css";

const BASE_URL = "http://127.0.0.1:5000";

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
    if (!form.email || !form.password) {
      alert("Fill all fields ❌");
      return;
    }

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
        alert("Login Success ✅");
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server not working ❌");
    }
  };

  return (
    <div className="access-container">
      <div className="card">
        <h2>Login 🔐</h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>Login</button>
      </div>
    </div>
  );
}

export default Access;