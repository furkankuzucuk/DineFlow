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
    setItems(all.filter(i => i.categoryId === parseInt(id)));
  }

  function addToCart(item) {
    setCart(prev => [...prev, item]);
  }

  async function handleOrder() {
    try {
      const order = {
        customerName: "Masa 5", // burayı formdan da alabiliriz
        items: cart.map(c => ({ menuItemId: c.id, quantity: 1 })),
      };
      await createOrder(order);
      setMessage("✅ Sipariş başarıyla gönderildi!");
      setCart([]);
    } catch (err) {
      setMessage("❌ Sipariş gönderilemedi.");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Ürünler</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {items.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-4 text-center"
          >
            <h2 className="font-semibold text-lg mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-3">{item.price} ₺</p>
            <button
              onClick={() => addToCart(item)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Sepete Ekle
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-5 right-5 bg-white shadow-lg p-4 rounded-lg border">
          <h3 className="font-semibold">🛒 Sepet ({cart.length})</h3>
          {cart.map((c, i) => (
            <p key={i}>{c.name} - {c.price} ₺</p>
          ))}
          <button
            onClick={handleOrder}
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Sipariş Gönder
          </button>
        </div>
      )}

      {message && (
        <div className="fixed bottom-20 right-5 bg-green-100 text-green-800 p-3 rounded shadow">
          {message}
        </div>
      )}
    </div>
  );
}
