const API_BASE = "http://localhost:5180/api";

export async function fetchMenuItems() {
  const res = await fetch(`${API_BASE}/MenuItems`);
  return await res.json();
}

export async function createOrder(orderData) {
  const res = await fetch(`${API_BASE}/Orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  return await res.json();
}
