import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import TablesPage from "./assets/pages/TablesPage";
import MenuPage from "./assets/pages/MenuPage";
import OrdersPage from "./assets/pages/OrdersPage";

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="DineFlow"
                className="h-9 w-9 object-contain"
              />
              <span className="font-extrabold text-xl text-primary tracking-tight">
                DineFlow <span className="text-secondary">POS</span>
              </span>
            </div>

            
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className={`h-10 px-4 flex items-center gap-2 rounded-lg text-sm font-bold transition
                ${
                  location.pathname === "/"
                    ? "bg-secondary/10 text-secondary"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                🪑 Masalar
              </Link>

              <Link
                to="/orders"
                className={`h-10 px-4 flex items-center gap-2 rounded-lg text-sm font-bold transition
                ${
                  location.pathname === "/orders"
                    ? "bg-primary/10 text-primary"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                👨‍🍳 Mutfak
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <Routes>
          <Route path="/" element={<TablesPage />} />
          <Route path="/menu/:tableName" element={<MenuPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </div>
    </div>
  );
}