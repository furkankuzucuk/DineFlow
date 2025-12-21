import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import TablesPage from "./assets/pages/TablesPage"; // Yeni sayfamız
import MenuPage from "./assets/pages/MenuPage";
import OrdersPage from "./assets/pages/OrdersPage";

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-orange-500 to-amber-500 text-white p-2 rounded-xl font-bold text-xl shadow-md">
                DF
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-800">
                DineFlow <span className="text-orange-600">POS</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${location.pathname === '/' ? 'bg-orange-50 text-orange-700 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                🪑 Masalar
              </Link>
              
              <Link 
                to="/orders" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${location.pathname === '/orders' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                🧾 Mutfak
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<TablesPage />} />
          <Route path="/menu/:tableName" element={<MenuPage />} /> {/* DİNAMİK MASA LİNKİ */}
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </div>
    </div>
  );
}