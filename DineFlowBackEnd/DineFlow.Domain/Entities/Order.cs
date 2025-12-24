namespace DineFlow.Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.Now;

   
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        public bool IsActive { get; set; } = true; 

        
        public bool IsReady { get; set; } = false; 
    }
}