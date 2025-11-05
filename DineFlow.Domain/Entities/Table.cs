namespace DineFlow.Domain.Entities
{
    public class Table
    {
        public int Id { get; set; }
        public int TableNumber { get; set; }

        // Siparişlerle ilişki
        public ICollection<Order>? Orders { get; set; }
    }
}
