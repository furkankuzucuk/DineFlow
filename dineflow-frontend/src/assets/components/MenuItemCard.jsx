import React from "react";

export default function MenuItemCard({ item, onAdd }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
      <p className="text-sm text-gray-500">{item.categoryName}</p>
      <p className="font-bold text-green-700 text-lg">{item.price} ₺</p>
      <button
        onClick={() => onAdd(item)}
        className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Sepete Ekle
      </button>
    </div>
  );
}
