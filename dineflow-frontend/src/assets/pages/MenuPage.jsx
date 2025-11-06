import React, { useEffect, useState } from "react";
import { fetchMenuItems, createOrder } from "../api";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const data = await fetchMenuItems();
      setMenu(data);
    } catch (err) {
      console.error("Menü yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!customerName.trim()) {
      alert("Lütfen müşteri adı veya masa numarası girin.");
      return;
    }
    if (cart.length === 0) {
      alert("Sepet boş!");
      return;
    }

    const orderData = {
      customerName,
      items: cart.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
    };

    try {
      await createOrder(orderData);
      alert("✅ Sipariş başarıyla oluşturuldu!");
      setCart([]);
      setCustomerName("");
    } catch (err) {
      console.error("❌ Sipariş gönderilemedi:", err);
      alert("Bir hata oluştu!");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Menü yükleniyor...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-100">
      {/* 🔸 Üst Navbar */}
      <header className="bg-orange-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">🍽️ DineFlow Garson Paneli</h1>
        <span className="text-sm opacity-90">Aktif Kullanıcı: Garson Furkan</span>
      </header>

      {/* 🔸 Ana İçerik Alanı */}
      <main className="flex flex-1 overflow-hidden">
        {/* Sol: Menü */}
        <section className="w-2/3 p-6 overflow-y-auto border-r border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Menü</h2>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {menu.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all duration-200 border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.categoryName}</p>
                  <p className="font-bold text-green-700 mt-1">
                    {item.price.toFixed(2)} ₺
                  </p>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition"
                >
                  ➕ Sepete Ekle
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Sağ: Sepet */}
        <aside className="w-1/3 bg-white p-6 shadow-inner flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-blue-700 mb-4">🧺 Sepet</h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">
                Sepet boş. Menüden ürün ekleyin.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <p className="font-medium text-gray-700">
                        {item.name} ({item.quantity}x)
                      </p>
                      <span className="text-sm text-gray-500">
                        {item.price.toFixed(2)} ₺
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Toplam + Sipariş Alanı */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between mb-3">
              <span className="font-semibold text-gray-700">Toplam:</span>
              <span className="font-bold text-green-700 text-lg">
                {total.toFixed(2)} ₺
              </span>
            </div>

            <input
              type="text"
              placeholder="Müşteri / Masa Adı"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-gray-300 focus:border-orange-400 focus:ring focus:ring-orange-100 p-2 rounded-lg mb-3"
            />

            <button
              onClick={handleOrder}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              ✅ Siparişi Gönder
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
