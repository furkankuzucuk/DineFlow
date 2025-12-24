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

       
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest request)
        {
            if (request == null || request.Items == null || !request.Items.Any())
                return BadRequest("Sipariş içeriği boş olamaz.");

           
            var existingOrder = await _context.Orders
                .Include(o => o.OrderItems) 
                .FirstOrDefaultAsync(o => o.CustomerName == request.CustomerName && o.IsActive);

            if (existingOrder != null)
            {
                
                foreach (var item in request.Items)
                {
                    var menuItem = await _context.MenuItems.FindAsync(item.MenuItemId);
                    if (menuItem != null)
                    {
                        existingOrder.OrderItems.Add(new OrderItem
                        {
                            MenuItemId = item.MenuItemId,
                            Quantity = item.Quantity
                     
                        });
                    }
                }
                
              
                existingOrder.IsReady = false; 

                await _context.SaveChangesAsync();
                return Ok(new { message = "Sipariş mevcut adisyona eklendi", orderId = existingOrder.Id });
            }
            else
            {
                
                var order = new Order
                {
                    CustomerName = request.CustomerName,
                    CreatedAt = DateTime.Now,
                    IsActive = true,  
                    IsReady = false,  
                    OrderItems = new List<OrderItem>()
                };

                foreach (var item in request.Items)
                {
                    var menuItem = await _context.MenuItems.FindAsync(item.MenuItemId);
                    if (menuItem != null)
                    {
                        order.OrderItems.Add(new OrderItem
                        {
                            MenuItemId = item.MenuItemId,
                            Quantity = item.Quantity
                        });
                    }
                }

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Yeni sipariş oluşturuldu", orderId = order.Id });
            }
        }

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
                    
              
                    o.IsActive, 
                    o.IsReady, 

                    Items = o.OrderItems.Select(i => new
                    {
                        Name = i.MenuItem.Name,
                        i.Quantity,
                        Price = i.MenuItem.Price
                    }),
                   
                    Total = o.OrderItems.Sum(i => i.MenuItem.Price * i.Quantity)
                })
                .ToList();

            return Ok(orders);
        }

        
        [HttpPut("{id}/ready")]
        public async Task<IActionResult> MarkAsReady(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound("Sipariş bulunamadı.");

            order.IsReady = true; 
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Sipariş hazırlandı olarak işaretlendi." });
        }

        [HttpPost("{tableName}/close")]
        public async Task<IActionResult> CloseOrder(string tableName)
        {
            
            var activeOrder = await _context.Orders
                .FirstOrDefaultAsync(o => o.CustomerName == tableName && o.IsActive);

            if (activeOrder == null) 
                return NotFound("Bu masa için açık bir adisyon bulunamadı.");

            activeOrder.IsActive = false; 
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "Hesap kapatıldı, masa sıfırlandı." });
        }
    }

   
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