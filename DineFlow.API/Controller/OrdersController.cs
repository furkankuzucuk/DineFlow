using DineFlow.Infrastructure.Persistence;
using DineFlow.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DineFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly DineFlowDbContext _context;

        public OrdersController(DineFlowDbContext context)
        {
            _context = context;
        }

        // 🔹 Sipariş oluşturma
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest request)
        {
            if (request == null || request.Items == null || !request.Items.Any())
                return BadRequest("Sipariş boş olamaz.");

            var order = new Order
            {
                CustomerName = request.CustomerName,
                CreatedAt = DateTime.Now,
                OrderItems = new List<OrderItem>()
            };

            foreach (var item in request.Items)
            {
                var menuItem = await _context.MenuItems.FindAsync(item.MenuItemId);
                if (menuItem == null)
                    return BadRequest($"MenuItem ID {item.MenuItemId} bulunamadı.");

                order.OrderItems.Add(new OrderItem
                {
                    MenuItemId = item.MenuItemId,
                    Quantity = item.Quantity
                });
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Sipariş başarıyla oluşturuldu",
                orderId = order.Id
            });
        }

        // 🔹 Siparişleri listeleme (frontend için)
        [HttpGet]
        public IActionResult GetOrders()
        {
            var orders = _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(i => i.MenuItem)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    o.CustomerName,
                    o.CreatedAt,
                    Items = o.OrderItems.Select(i => new
                    {
                        i.MenuItem.Name,
                        i.Quantity,
                        i.MenuItem.Price
                    }),
                    Total = o.OrderItems.Sum(i => i.MenuItem.Price * i.Quantity)
                })
                .ToList();

            return Ok(orders);
        }
    }

    // 🔹 DTO modelleri
    public class OrderRequest
    {
        public string CustomerName { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }

    public class OrderItemDto
    {
        public int MenuItemId { get; set; }
        public int Quantity { get; set; }
    }
}
