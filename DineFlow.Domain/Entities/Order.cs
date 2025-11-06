namespace DineFlow.Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }

        // 🔸 Masanın numarası (örneğin masa 1, masa 2 vs.)
        public int TableNumber { get; set; }

        // 🔸 Siparişin oluşturulma zamanı
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // 🔸 Toplam fiyat
        public decimal TotalPrice { get; set; }

        // 🔸 İlişki: 1 sipariş → N sipariş öğesi
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
