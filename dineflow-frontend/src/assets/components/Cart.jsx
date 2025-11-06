import React from "react";

export default function Cart({ cart, onRemove, onSubmit }) {
  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3 text-center">🛒 Sepet</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500 text-center">Sepet boş</p>
      ) : (
        <>
          <ul className="max-h-60 overflow-y-auto mb-3">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500">
                    {" "}
                    x {item.quantity}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500"
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Toplam:</span>
            <span>{total.toFixed(2)} ₺</span>
          </div>

          <button
            onClick={onSubmit}
            className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Siparişi Onayla
          </button>
        </>
      )}
    </div>
  );
}
