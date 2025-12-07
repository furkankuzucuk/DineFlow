using DineFlow.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DineFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuItemsController : ControllerBase
    {
        private readonly DineFlowDbContext _context;

        public MenuItemsController(DineFlowDbContext context)
        {
            _context = context;
        }

        // 🔹 Tüm menü öğelerini getir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _context.MenuItems
                .Include(m => m.Category)
                .Select(m => new
                {
                    m.Id,
                    m.Name,
                    m.Price,
                    CategoryName = m.Category != null ? m.Category.Name : "Kategori Yok"
                })
                .ToListAsync();

            return Ok(items);
        }

        // 🔹 Kategoriye göre menü öğelerini getir
        [HttpGet("category/{id}")]
        public async Task<IActionResult> GetByCategory(int id)
        {
            var items = await _context.MenuItems
                .Where(m => m.CategoryId == id)
                .Include(m => m.Category)
                .Select(m => new
                {
                    m.Id,
                    m.Name,
                    m.Price,
                    CategoryName = m.Category != null ? m.Category.Name : "Kategori Yok"
                })
                .ToListAsync();

            if (items.Count == 0)
                return NotFound(new { Message = "Bu kategoriye ait ürün bulunamadı." });

            return Ok(items);
        }
    }
}
