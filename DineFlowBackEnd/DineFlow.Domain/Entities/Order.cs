namespace DineFlow.Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } // Masa Adı (Örn: Masa 5)
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Sipariş Kalemleri (Null hatası almamak için new List yapıyoruz)
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        // ✅ YENİ: Masa hala oturuyor mu? (Hesap ödenmediyse true)
        // Varsayılan true, çünkü sipariş açılınca masa dolar.
        public bool IsActive { get; set; } = true; 

        // ✅ YENİ: Mutfakta yemek pişti mi? (Hazırlandıysa true)
        // Varsayılan false, çünkü yeni sipariş pişmemiştir.
        public bool IsReady { get; set; } = false; 
    }
}