namespace DineFlow.Domain.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // Navigation property
        public ICollection<MenuItem>? MenuItems { get; set; }
    }
}
