import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((u) => {
      setUser(u);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* Login route */}
        <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" />} />

        {/* Dashboard protected */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  );
}