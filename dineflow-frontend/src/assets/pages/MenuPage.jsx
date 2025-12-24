import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMenuItems, createOrder, closeOrder } from "@/api";

export default function MenuPage() {
  const { tableName } = useParams();
  const navigate = useNavigate();

  // State'ler
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [existingOrder, setExistingOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Sipariş verilerini çek
  const loadOrderData = useCallback(() => {
    fetch("http://localhost:5180/api/Orders")
      .then((res) => res.json())
      .then((data) => {
        const active = data.find(
          (o) =>
            (o.customerName === tableName || o.CustomerName === tableName) &&
            (o.isActive === true || o.IsActive === true)
        );
        if (active) setExistingOrder(active);
        else setExistingOrder(null);
      })
      .catch((err) => console.error("Sipariş verisi çekilemedi:", err));
  }, [tableName]);

  useEffect(() => {
    fetchMenuItems().then(setMenu).catch(console.error);
    loadOrderData();
  }, [tableName, loadOrderData]);

  // ✅ KATEGORİLERİ OLUŞTUR (Boş gelenleri 'Diğer' yap)
  const categories = ["Tümü", ...new Set(menu.map((i) => i.categoryName ? i.categoryName : "Diğer"))];
  
  // ✅ FİLTRELEME MANTIĞI
  const filteredMenu = selectedCategory === "Tümü" 
    ? menu 
    : menu.filter((i) => (i.categoryName || "Diğer") === selectedCategory);

  const formatPrice = (value) => {
    const num = Number(value) || 0;
    return num.toFixed(2);
  };

  const addToCart = (item) => {
    if (!item.id) return alert("Hatalı ürün ID'si");
    setCart((prev) => {
      const exist = prev.find((p) => p.id === item.id);
      return exist
        ? prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p))
        : [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === item.id);
      if (exist?.quantity > 1) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity - 1 } : p));
      } else {
        return prev.filter((p) => p.id !== item.id);
      }
    });
  };

  const handleOrder = async () => {
    if (cart.length === 0) return alert("Sepet boş!");
    try {
      const orderData = {
        customerName: tableName,
        items: cart.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
      };
      await createOrder(orderData);
      alert("✅ Sipariş mutfağa iletildi!");
      setCart([]);
      loadOrderData();
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  const handleOpenReceipt = () => setShowReceipt(true);

  const confirmCloseOrder = async () => {
    try {
      await closeOrder(tableName);
      alert("✅ Ödeme alındı, masa kapatıldı.");
      navigate("/");
    } catch (err) {
      alert("Hata!");
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const existingTotal = existingOrder ? existingOrder.total || existingOrder.Total || 0 : 0;
  const grandTotal = existingTotal + cartTotal;

  return (
    <div className="fixed inset-0 flex bg-gray-50 font-sans text-gray-800 overflow-hidden">
      
      
      <div className="flex-1 flex flex-col h-full border-r border-gray-200 min-w-0">
        
       
        <header className="bg-white border-b border-gray-100 shrink-0">
          
          
          <div className="h-16 px-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/")} className="bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                <span>⬅</span> Masalar
              </button>
              <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>
              <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">DineFlow</span>
            </div>
            
      
            <div className="font-bold text-lg text-orange-600 border border-orange-100 bg-orange-50 px-3 py-1 rounded-lg">
              {tableName}
            </div>
          </div>

        
          <div className="px-6 pb-3 pt-1">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border
                    ${selectedCategory === cat 
                      ? "bg-gray-900 text-white border-gray-900 shadow-md transform scale-105" 
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>
        
      
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {filteredMenu.map((item) => (
              <div key={item.id} onClick={() => addToCart(item)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-orange-400 hover:shadow-lg transition-all active:scale-95 flex flex-col justify-between h-36 select-none group">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-tight group-hover:text-orange-700">{item.name}</h3>
                  <span className="text-[10px] text-gray-400 font-bold uppercase mt-1.5 block tracking-wide">{item.categoryName || "Diğer"}</span>
                </div>
                <div className="text-right mt-2">
                  <span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-lg text-sm font-bold border border-orange-100">{formatPrice(item.price)} ₺</span>
                </div>
              </div>
            ))}
            {filteredMenu.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-400">
                Bu kategoride ürün bulunamadı.
              </div>
            )}
          </div>
        </div>
      </div>

      
      <div className="w-[380px] h-full bg-white shadow-2xl flex flex-col border-l border-gray-200 z-20 shrink-0 overflow-hidden relative">
        <div className="h-14 bg-gray-900 text-white px-5 flex justify-between items-center shadow-md shrink-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <span className="font-bold text-lg tracking-wide">Adisyon</span>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded font-bold uppercase ${cart.length > 0 ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-300"}`}>
            {cart.length > 0 ? "Hazırlanıyor" : "Beklemede"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 min-h-0 scrollbar-thin scrollbar-thumb-gray-200">
          {existingOrder?.items?.length > 0 && (
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">İletilenler</h3>
                <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{formatPrice(existingTotal)} ₺</span>
              </div>
              <div className="space-y-1">
                {existingOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-600 py-1 px-1 hover:bg-gray-50 rounded">
                    <span className="flex gap-2"><span className="font-bold text-gray-400">{item.quantity}x</span><span>{item.name}</span></span>
                    <span className="font-mono">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cart.length > 0 ? (
            <div className="space-y-2 pb-2">
              <h3 className="text-xs font-bold text-orange-600 uppercase mb-2 tracking-wider sticky top-0 bg-white z-10 py-1">Yeni Eklenecekler</h3>
              {cart.map((i) => (
                <div key={i.id} className="flex justify-between items-center text-sm font-medium text-gray-800 bg-orange-50 p-2.5 rounded-lg border border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="bg-white text-orange-600 text-xs font-bold px-1.5 py-0.5 rounded shadow-sm border border-orange-100">{i.quantity}</span>
                    <span className="truncate max-w-[120px]">{i.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono">{formatPrice(i.price * i.quantity)}</span>
                    <button onClick={(e) => { e.stopPropagation(); removeFromCart(i); }} className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50">✕</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             !existingOrder && (
              <div className="flex flex-col items-center justify-center h-full text-gray-300 select-none min-h-[200px]">
                <span className="text-5xl mb-4 grayscale opacity-50">🍽️</span>
                <p className="text-sm font-medium">Sipariş yok.</p>
              </div>
             )
          )}
        </div>

        <div className="bg-white border-t border-gray-200 p-4 shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20">
          <div className="flex justify-between items-end mb-3">
            <span className="text-gray-500 font-medium text-xs mb-1">Genel Toplam</span>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">{formatPrice(grandTotal)}<span className="text-sm text-gray-400 font-medium ml-1">₺</span></span>
          </div>
          <div className="grid gap-2">
            <button onClick={handleOrder} disabled={cart.length === 0} className={`w-full py-3 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 flex justify-center items-center gap-2 ${cart.length === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" : "bg-gray-900 text-white hover:bg-gray-800"}`}>
              <span>🔥</span> Siparişi Onayla
            </button>
            {existingOrder && (
              <button onClick={handleOpenReceipt} className="w-full bg-white text-red-600 border border-red-200 hover:bg-red-50 py-3 rounded-lg font-bold text-sm transition-all active:scale-95">💳 Hesabı Kapat</button>
            )}
          </div>
        </div>
      </div>

      {showReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            <div className="bg-gray-900 text-white p-4 text-center relative shrink-0">
               <button onClick={() => setShowReceipt(false)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">✕</button>
               <div className="font-bold text-lg uppercase tracking-widest">DineFlow</div>
            </div>
            <div className="p-6 bg-gray-50 overflow-y-auto flex-1">
              <div className="bg-white p-4 shadow-sm border border-gray-200 rounded-lg font-mono text-sm text-gray-700 space-y-4">
                <div className="text-center border-b border-dashed border-gray-300 pb-4">
                  <h2 className="text-xl font-bold text-black mb-1">{tableName}</h2>
                  <p className="text-xs text-gray-500">{new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}</p>
                </div>
                <div className="space-y-2">
                  {existingOrder?.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between border-b border-gray-50 pb-1 last:border-0">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-dashed border-gray-800 pt-4 flex justify-between font-bold text-black text-lg">
                  <span>TOPLAM</span>
                  <span>{formatPrice(existingTotal)} ₺</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white border-t border-gray-100 flex gap-3 shrink-0">
              <button onClick={() => setShowReceipt(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">İptal</button>
              <button onClick={confirmCloseOrder} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 hover:bg-green-700">Ödemeyi Al</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}