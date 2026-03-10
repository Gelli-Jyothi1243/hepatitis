import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import DashboardLayout from "./DashboardLayout";
import Prediction from "./Prediction";
import Tracker from "./Tracker";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userId")
  );

  return (
    <BrowserRouter>
      <Routes>
        {!isLoggedIn ? (
          <Route path="*" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        ) : (
          <>
            <Route path="/dashboard" element={<DashboardLayout />}>
              {/* Default Page */}
              <Route index element={<Prediction />} />

              <Route path="tracker" element={<Tracker />} />
            </Route>

            {/* Redirect root to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;