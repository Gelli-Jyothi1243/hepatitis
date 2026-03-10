import React, { useState } from "react";
import Signup from "./Signup";

function Login({ setIsLoggedIn }) {
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔐 LOGIN HANDLER (UNCHANGED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ STORE USER ID (UNCHANGED)
      localStorage.setItem("userId", data.userId);

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error");
    }
  };

  // 🔁 SWITCH TO SIGNUP (UNCHANGED)
  if (showSignup) {
    return (
      <Signup
        setIsLoggedIn={setIsLoggedIn}
        setShowSignup={setShowSignup}
      />
    );
  }

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

        .login-container {
          height: 100vh;
          background: linear-gradient(135deg, #e0f7fa, #e3f2fd);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-card {
          background: #ffffff;
          width: 420px;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          transition: 0.3s ease-in-out;
        }

        .login-card:hover {
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
          font-size: 30px;
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

        .signup-text {
          margin-top: 20px;
          font-size: 14px;
          text-align: center;
          color: #475569;
        }

        .signup-text span {
          color: #1976d2;
          cursor: pointer;
          font-weight: 600;
        }

        .signup-text span:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <div className="icon">🩺</div>

          <h2>Hepatitis Prediction System</h2>
          <p className="subtitle">
            Secure login to access liver disease prediction and health analysis
          </p>

          <form onSubmit={handleSubmit}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="doctor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login to Dashboard</button>
          </form>

          <p className="signup-text">
            Don’t have an account?{" "}
            <span onClick={() => setShowSignup(true)}>
              Register here
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;