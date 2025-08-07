import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/feed" /> : <AuthPage />} />
      <Route path="/feed" element={isLoggedIn ? <FeedPage /> : <Navigate to="/" />} />
      <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
