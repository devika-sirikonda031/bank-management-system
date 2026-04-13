import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateAccount.css";

const BASE_URL = "https://bank-management-system-b33i.onrender.com";

function CreateAccount() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    aadhaar: "",
    mobile: "",
    age: "",
    dob: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
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
        localStorage.setItem("account_number", data.account_number);
        localStorage.setItem("ifsc", data.ifsc);

        alert(
          `Account Created Successfully ✅\n\nAccount Number: ${data.account_number}\nIFSC: ${data.ifsc}`
        );

        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server not working ❌");
    }
  };

  return (
    <div className="create-container">
      <div className="card">
        <h2>Create Account 🏦</h2>

        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <input name="aadhaar" placeholder="Aadhaar Number" onChange={handleChange} />
        <input name="mobile" placeholder="Mobile Number" onChange={handleChange} />
        <input name="age" placeholder="Age" onChange={handleChange} />
        <input type="date" name="dob" onChange={handleChange} />

        <button onClick={handleSubmit}>Create Account</button>
      </div>
    </div>
  );
}

export default CreateAccount;