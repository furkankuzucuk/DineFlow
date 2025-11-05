using DineFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DineFlow.Infrastructure.Persistence
{
    public class DineFlowDbContext : DbContext
    {
        public DineFlowDbContext(DbContextOptions<DineFlowDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
