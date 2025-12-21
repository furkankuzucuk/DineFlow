import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMenuItems, createOrder } from "../api";

export default function CategoryView() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadItems();
  }, [id]);

  async function loadItems() {
    const all = await fetchMenuItems();
    setItems(all.filter((i) => i.categoryId === parseInt(id)));
  }

  function addToCart(item) {
    setCart((prev) => [...prev, item]);
  }

  async function handleOrder() {
    try {
      const order = {
        customerName: "Masa 5", // Demo veri
        items: cart.map((c) => ({ menuItemId: c.id, quantity: 1 })),
      };
      await createOrder(order);
      setMessage("✅ Sipariş mutfağa iletildi!");
      setTimeout(() => setMessage(""), 3000);
      setCart([]);
    } catch (err) {
      setMessage("❌ Sipariş hatası.");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            <span className="text-orange-500">DineFlow</span> Menü
          </h1>
          <p className="text-gray-500 mt-2">Lezzetli seçeneklerimizi keşfedin</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <div className="h-32 bg-amber-50 rounded-xl mb-4 flex items-center justify-center text-4xl">
                  🍕
                </div>
                <h2 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h2>
                <p className="text-gray-400 text-xs mb-3">Kategori ID: {id}</p>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xl font-bold text-gray-900">{item.price} ₺</span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md"
                >
                  Ekle +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sepet Float Action Button (FAB) Style */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-white shadow-2xl p-4 rounded-2xl border border-orange-100 z-50 w-80 animate-fade-in-up">
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <h3 className="font-bold text-gray-800">Sepetiniz ({cart.length})</h3>
              <button onClick={() => setCart([])} className="text-xs text-red-500 hover:underline">Temizle</button>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-2 mb-3 text-sm text-gray-600">
              {cart.map((c, i) => (
                <div key={i} className="flex justify-between">
                  <span>{c.name}</span>
                  <span className="font-medium">{c.price} ₺</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleOrder}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-xl font-medium transition-colors"
            >
              Siparişi Tamamla
            </button>
          </div>
        )}

        {/* Mesaj Toast */}
        {message && (
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}