using DineFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization; // 👈 eklendi

var builder = WebApplication.CreateBuilder(args);

// ✅ JSON döngü hatasını engelle (önceki hatanı da çözer)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true; // çıktı okunaklı olsun
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Veritabanı bağlantısı
builder.Services.AddDbContext<DineFlowDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// ✅ Swagger’ı her ortamda aktif et (sadece Development’ta değil)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "DineFlow API v1");
    c.RoutePrefix = string.Empty; // 👈 https://localhost:7287 direkt Swagger olur
});

// ✅ HTTPS yönlendirmesi aktif (launchSettings.json’da 7287 varsa sorun çıkmaz)
app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();

app.Run();
