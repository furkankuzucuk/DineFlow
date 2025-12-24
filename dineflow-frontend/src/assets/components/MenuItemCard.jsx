import React from "react";

export default function MenuItemCard({ item, onAdd }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">

      <div className="h-32 bg-gradient-to-r from-orange-400 to-amber-300 flex items-center justify-center text-white text-4xl">
        🍽️
      </div>
      
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1">{item.name}</h3>
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
              {item.categoryName || "Genel"}
            </span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">Lezzetli ve taze hazırlanmış menü ürünü.</p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xl font-extrabold text-gray-900">{item.price} ₺</span>
          <button
            onClick={() => onAdd(item)}
            className="bg-gray-900 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors shadow-lg active:scale-95 flex items-center gap-2 px-4"
          >
            <span>Ekle</span>
            <span className="text-lg">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}