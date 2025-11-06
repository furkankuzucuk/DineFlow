using DineFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DineFlow.Domain.Entities;

namespace DineFlow.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly DineFlowDbContext _context;

        public OrdersController(DineFlowDbContext context)
        {
            _context = context;
        }

        // 🟢 Sipariş oluştur
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
        {
            if (dto == null || dto.Items.Count == 0)
                return BadRequest("Sipariş verisi eksik veya geçersiz.");

            var order = new Order
            {
                TableNumber = dto.TableNumber,   // ✅ artık int
                CreatedAt = DateTime.Now,
                TotalPrice = 0
            };

            foreach (var item in dto.Items)
            {
                var menuItem = await _context.MenuItems.FindAsync(item.MenuItemId);
                if (menuItem == null)
                    return NotFound($"Menu item {item.MenuItemId} bulunamadı.");

                var orderItem = new OrderItem
                {
                    MenuItemId = item.MenuItemId,
                    Quantity = item.Quantity,
                    TotalPrice = menuItem.Price * item.Quantity
                };

                order.OrderItems.Add(orderItem);
                order.TotalPrice += orderItem.TotalPrice;
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                order.Id,
                order.TableNumber,
                order.TotalPrice,
                order.CreatedAt
            });
        }

        // 🟡 Tüm siparişleri listele
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .Select(o => new
                {
                    o.Id,
                    o.TableNumber,
                    o.CreatedAt,
                    o.TotalPrice,
                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.MenuItem.Name,
                        oi.Quantity,
                        Price = oi.MenuItem.Price * oi.Quantity
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }
    }

    // 🧾 DTO’lar
    public class OrderCreateDto
    {
        public int TableNumber { get; set; }  // 🔧 string → int
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class OrderItemDto
    {
        public int MenuItemId { get; set; }
        public int Quantity { get; set; }
    }
}
