import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TablesPage() {
  const navigate = useNavigate();
  const [activeTables, setActiveTables] = useState([]);

  const tables = Array.from({ length: 10 }, (_, i) => `Masa ${i + 1}`);

  useEffect(() => {
    fetch("http://localhost:5180/api/Orders")
      .then((res) => res.json())
      .then((data) => {
        console.log("Gelen Veri (Masalar):", data); // Konsola bakmak için

        const busyTables = data
          // 1. Filtre: Masa Açık mı? (Büyük/Küçük harf kontrolü)
          .filter((o) => o.isActive === true || o.IsActive === true)
          // 2. Harita: Masa İsmini Al (Büyük/Küçük harf kontrolü)
          // ✅ SORUN BURADAYDI: customerName yoksa CustomerName'i al dedik.
          .map((o) => o.customerName || o.CustomerName); 
        
        setActiveTables(busyTables);
      })
      .catch((err) => console.error("Hata:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Restoran Yerleşimi</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
        {tables.map((tableName) => {
          const isBusy = activeTables.includes(tableName);
          return (
            <button
              key={tableName}
              onClick={() => navigate(`/menu/${tableName}`)}
              className={`h-40 rounded-2xl shadow-lg border-4 flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95
                ${isBusy 
                  ? "bg-red-100 border-red-500 text-red-700" 
                  : "bg-white border-green-400 text-gray-700 hover:bg-green-50"}`}
            >
              <span className="text-4xl mb-2">{isBusy ? "🍲" : "🍽️"}</span>
              <span className="text-xl font-bold">{tableName}</span>
              <span className={`mt-3 px-4 py-1 rounded-full text-sm font-bold ${isBusy ? "bg-red-500 text-white" : "bg-green-200 text-green-800"}`}>
                {isBusy ? "DOLU" : "BOŞ"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}