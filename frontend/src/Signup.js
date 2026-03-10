import React, { useState } from "react";

function Signup({ setIsLoggedIn, setShowSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // ✅ Added Phone
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // ✅ Send phone to backend
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Account created successfully ✅ Please login.");
      setShowSignup(false);

    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
          margin: 0;
        }

        .signup-container {
          height: 100vh;
          background: linear-gradient(135deg, #e0f7fa, #e3f2fd);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .signup-card {
          background: #ffffff;
          width: 430px;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          transition: 0.3s ease-in-out;
        }

        .signup-card:hover {
          transform: translateY(-5px);
        }

        .icon {
          width: 60px;
          height: 60px;
          background: #e3f2fd;
          color: #1976d2;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 20px;
        }

        h2 {
          margin: 0;
          font-weight: 600;
          color: #0f172a;
        }

        .subtitle {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 25px;
        }

        label {
          display: block;
          font-size: 14px;
          margin-top: 18px;
          color: #334155;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          margin-top: 6px;
          outline: none;
          transition: 0.3s;
        }

        input:focus {
          border-color: #1976d2;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
        }

        button {
          width: 100%;
          margin-top: 28px;
          padding: 13px;
          background: #1976d2;
          border: none;
          color: white;
          font-size: 15px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s;
        }

        button:hover {
          background: #1565c0;
        }

        .signin-text {
          margin-top: 20px;
          font-size: 14px;
          text-align: center;
          color: #475569;
        }

        .signin-text span {
          color: #1976d2;
          cursor: pointer;
          font-weight: 600;
        }

        .signin-text span:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="signup-container">
        <div className="signup-card">
          <div className="icon">🧬</div>

          <h2>Hepatitis Prediction System</h2>
          <p className="subtitle">
            Create your secure account to access liver disease analysis tools
          </p>

          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Dr. / Patient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="health@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* ✅ Phone Number Field */}
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit">Create Account</button>
          </form>

          <p className="signin-text">
            Already registered?{" "}
            <span onClick={() => setShowSignup(false)}>
              Login here
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;