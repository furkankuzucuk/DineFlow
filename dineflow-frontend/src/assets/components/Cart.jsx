import React from "react";

export default function Cart({ cart, onRemove, onSubmit }) {
  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full">
      {/* Başlık */}
      <div className="p-4 bg-gray-50 border-b border-gray-100 rounded-t-2xl flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          🛍️ Sipariş Özeti
        </h2>
        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
          {cart.length} Ürün
        </span>
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <span className="text-4xl mb-2">🛒</span>
            <p>Sepetiniz henüz boş.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{item.name}</span>
                <span className="text-xs text-gray-500 font-medium">
                  Birim: {item.price} ₺ x {item.quantity}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900">
                  {(item.price * item.quantity).toFixed(2)} ₺
                </span>
                <button
                  onClick={() => onRemove(item.id)}
                  className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
                  title="Ürünü Sil"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alt Kısım */}
      {cart.length > 0 && (
        <div className="p-5 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <div className="flex justify-between items-end mb-4">
            <span className="text-gray-500 text-sm font-medium">Toplam Tutar</span>
            <span className="text-2xl font-black text-gray-900">
              {total.toFixed(2)} <span className="text-sm font-normal text-gray-500">₺</span>
            </span>
          </div>

          <button
            onClick={onSubmit}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-green-200/50 transition-all active:scale-95"
          >
            Siparişi Onayla →
          </button>
        </div>
      )}
    </div>
  );
}