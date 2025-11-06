import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import MenuPage from "./assets/pages/MenuPage";
import OrdersPage from "./assets/pages/OrdersPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 Navbar */}
      <nav className="bg-green-700 text-white p-4 flex justify-center gap-6 shadow-md">
        <Link to="/" className="hover:underline">
          🍽️ Menü
        </Link>
        <Link to="/orders" className="hover:underline">
          🧾 Siparişler
        </Link>
      </nav>

      {/* 🔹 Sayfalar */}
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </div>
  );
}
