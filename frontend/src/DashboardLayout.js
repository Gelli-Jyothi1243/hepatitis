import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        * { 
          font-family: 'Segoe UI', sans-serif; 
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body { 
          background: #f5f5f5;
        }

        .navbar {
          background: white;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .logo {
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }

        .nav-links {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .nav-links a {
          text-decoration: none;
          color: #666;
          font-size: 16px;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .nav-links a:hover {
          background: #f0f0f0;
          color: #333;
        }

        .logout {
          cursor: pointer;
          color: #e74c3c;
          font-size: 16px;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .logout:hover {
          background: #fee;
        }

        .content {
          padding: 30px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media(max-width: 768px) {
          .navbar {
            padding: 15px 20px;
            flex-direction: column;
            gap: 15px;
          }
          
          .nav-links {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="navbar">
        <div className="logo">🩺 Hepatitis Health System</div>

        <div className="nav-links">
          <Link to="/dashboard">Health Check</Link>
          <Link to="/dashboard/tracker">Medicine Reminders</Link>

          <span
            className="logout"
            onClick={() => {
              localStorage.clear();
              navigate("/");
              window.location.reload();
            }}
          >
            Logout
          </span>
        </div>
      </div>

      <div className="content">
        <Outlet />
      </div>
    </>
  );
}

export default DashboardLayout;