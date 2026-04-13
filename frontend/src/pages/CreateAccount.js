import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateAccount.css";

const BASE_URL = "http://127.0.0.1:5000";

function CreateAccount() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Fill all fields ❌");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/create-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.status === "success") {
        alert("Account Created ✅");
        navigate("/access");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server error ❌");
    }
  };

  return (
    <div className="create-container">
      <div className="card">
        <h2>Create Account 🏦</h2>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />

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

        <button onClick={handleSubmit}>Create Account</button>
      </div>
    </div>
  );
}

export default CreateAccount;