import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateAccount.css";

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
      console.log("Sending Data:", form);

      const res = await fetch("http://127.0.0.1:5000/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      console.log("Response:", data);

      if (data.status === "success") {
        // ✅ Save data in localStorage
        localStorage.setItem("account_number", data.account_number);
        localStorage.setItem("ifsc", data.ifsc);

        // ✅ Show alert
        alert(
          `Account Created Successfully ✅\n\nAccount Number: ${data.account_number}\nIFSC: ${data.ifsc}`
        );

        // ✅ Redirect to dashboard
        navigate("/dashboard");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server not working ❌ Check Flask");
    }
  };

  return (
    <div className="create-container">
      <div className="card">
        <h2>Create Account 🏦</h2>

        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
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