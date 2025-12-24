import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TablesPage() {
  const navigate = useNavigate();
  const [activeTables, setActiveTables] = useState([]);

  const tables = Array.from({ length: 10 }, (_, i) => `Masa ${i + 1}`);

  useEffect(() => {
    fetch("http://localhost:5180/api/Orders")
      .then(res => res.json())
      .then(data => {
        const busy = data
          .filter(o => o.isActive === true || o.IsActive === true)
          .map(o => o.customerName || o.CustomerName);
        setActiveTables(busy);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-center text-primary mb-8">
        Restoran Yerleşimi
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {tables.map((table) => {
          const isBusy = activeTables.includes(table);
          return (
            <button
              key={table}
              onClick={() => navigate(`/menu/${table}`)}
              className={`h-40 rounded-2xl border-2 shadow-md flex flex-col items-center justify-center transition
              ${
                isBusy
                  ? "bg-secondary/10 border-secondary text-secondary"
                  : "bg-white border-primary/40 text-primary hover:bg-primary/5"
              }`}
            >
              <span className="text-4xl mb-2">
                {isBusy ? "🍲" : "🍽️"}
              </span>
              <span className="text-lg font-bold">{table}</span>
              <span
                className={`mt-3 px-4 py-1 rounded-full text-xs font-bold
                ${
                  isBusy
                    ? "bg-secondary text-white"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {isBusy ? "DOLU" : "BOŞ"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}