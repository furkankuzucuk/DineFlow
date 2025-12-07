// DineFlow.Domain/Entities/Order.cs
namespace DineFlow.Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string CustomerName { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
