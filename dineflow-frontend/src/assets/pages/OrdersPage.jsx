import React, { useEffect, useState } from "react";
import { markOrderAsReady } from "@/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5180/api/Orders");
      const data = await res.json();
      console.log("Gelen Veri (Mutfak):", data); // Konsoldan kontrol et

      // ✅ KESİN ÇÖZÜM FİLTRESİ
      const kitchenOrders = data.filter(o => 
        // Masa Aktif mi? (isActive veya IsActive)
        (o.isActive === true || o.IsActive === true) && 
        // Hazır DEĞİL mi? (isReady veya IsReady)
        (o.isReady === false || o.IsReady === false)
      );
      
      setOrders(kitchenOrders);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReady = async (id) => {
    await markOrderAsReady(id);
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">👨‍🍳 Mutfak Ekranı ({orders.length})</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-5 rounded-xl shadow-lg border-l-8 border-orange-500">
            {/* Masa Adı Kontrolü: customerName veya CustomerName */}
            <h2 className="text-2xl font-bold mb-4">{order.customerName || order.CustomerName}</h2>
            
            <ul className="space-y-2 mb-4">
              {/* Items Kontrolü: items veya Items */}
              {(order.items || order.Items || []).map((item, idx) => (
                <li key={idx} className="border-b pb-2 flex justify-between font-medium">
                  {/* Ürün Adı Kontrolü: name veya Name */}
                  <span>{item.name || item.Name}</span>
                  <span className="bg-orange-100 px-2 rounded">x{item.quantity || item.Quantity}</span>
                </li>
              ))}
            </ul>
            
            <button onClick={() => handleReady(order.id || order.Id)} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
              ✅ Hazırlandı
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}