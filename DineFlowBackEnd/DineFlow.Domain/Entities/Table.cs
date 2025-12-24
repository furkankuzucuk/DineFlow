namespace DineFlow.Domain.Entities
{
    public class Table
    {
        public int Id { get; set; }
        public int TableNumber { get; set; }

       
        public ICollection<Order>? Orders { get; set; }
    }
}
