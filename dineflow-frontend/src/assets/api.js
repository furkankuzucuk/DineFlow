
const API_BASE = "http://localhost:5180/api";

export async function fetchMenuItems() {
  const res = await fetch(`${API_BASE}/MenuItems`);
  if (!res.ok) throw new Error("Menü getirilemedi");
  return await res.json();
}

export async function createOrder(orderData) {
  const res = await fetch(`${API_BASE}/Orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Sipariş oluşturulamadı");
  return await res.json();
}


export async function closeOrder(tableName) {
  const res = await fetch(`${API_BASE}/Orders/${tableName}/close`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Hesap kapatılamadı");
  return await res.json();
}