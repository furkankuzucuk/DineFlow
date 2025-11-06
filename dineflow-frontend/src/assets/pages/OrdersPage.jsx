import React, { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5180/api/Orders");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Siparişler alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Siparişler yükleniyor...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🧾 Aktif Siparişler</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">Henüz sipariş yok.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                🧍‍♂️ {order.customerName || "Masa"}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <ul className="text-sm mb-3">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between border-b py-1">
                    <span>{item.name}</span>
                    <span className="text-gray-600">
                      {item.quantity}x {item.price} ₺
                    </span>
                  </li>
                ))}
              </ul>

              <div className="text-right font-bold text-green-700">
                Toplam: {order.total.toFixed(2)} ₺
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
