import React, { useEffect, useState } from "react";
import { markOrderAsReady } from "@/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    const i = setInterval(fetchOrders, 5000);
    return () => clearInterval(i);
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:5180/api/Orders");
    const data = await res.json();
    setOrders(
      data.filter(
        o =>
          (o.isActive || o.IsActive) &&
          (o.isReady === false || o.IsReady === false)
      )
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6 text-primary">
        👨‍🍳 Mutfak ({orders.length})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orders.map(o => (
          <div
            key={o.id}
            className="bg-white p-5 rounded-xl shadow-md border-l-4 border-secondary"
          >
            <h2 className="font-bold text-lg mb-3 text-primary">
              {o.customerName || o.CustomerName}
            </h2>

            <ul className="space-y-2 mb-4">
              {(o.items || []).map((i, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{i.name}</span>
                  <span className="font-bold">x{i.quantity}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => markOrderAsReady(o.id)}
              className="w-full bg-secondary text-white py-2 rounded-lg font-bold hover:opacity-90"
            >
              Hazırlandı
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}