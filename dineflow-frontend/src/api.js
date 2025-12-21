const API_BASE = "http://localhost:5180/api";

// Menüyü Getir
export async function fetchMenuItems() {
  const res = await fetch(`${API_BASE}/MenuItems`);
  if (!res.ok) throw new Error("Menü getirilemedi");
  return await res.json();
}

// Sipariş Oluştur (Veya Mevcut Masaya Ekle)
export async function createOrder(orderData) {
  const res = await fetch(`${API_BASE}/Orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Sipariş oluşturulamadı");
  return await res.json();
}

// Mutfak: "Hazırlandı" Olarak İşaretle
export async function markOrderAsReady(orderId) {
  const res = await fetch(`${API_BASE}/Orders/${orderId}/ready`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Hazırlandı işaretlenemedi");
  return await res.json();
}

// Kasa: Hesabı Kapat ve Masayı Boşalt
export async function closeOrder(tableName) {
  const res = await fetch(`${API_BASE}/Orders/${tableName}/close`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Hesap kapatılamadı");
  return await res.json();
}