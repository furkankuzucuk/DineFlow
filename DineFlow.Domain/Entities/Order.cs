namespace DineFlow.Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsClosed { get; set; } = false;

        // Foreign Key
        public int TableId { get; set; }
        public Table? Table { get; set; }

        // Navigation
        public ICollection<OrderItem>? OrderItems { get; set; }
    }
}
