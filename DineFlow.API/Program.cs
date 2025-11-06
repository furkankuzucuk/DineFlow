using DineFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// ✅ JSON döngü hatasını engelle (örneğin Category → MenuItem ilişkilerinde)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true; // çıktı okunaklı olsun
    });

// ✅ CORS ayarları (React frontend’e izin veriyoruz)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // React portu
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Veritabanı bağlantısı
builder.Services.AddDbContext<DineFlowDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// ✅ Swagger her ortamda açık (Development şartı olmadan)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "DineFlow API v1");
    c.RoutePrefix = string.Empty; // https://localhost:7287 veya http://localhost:5180 direkt Swagger olur
});

// ✅ HTTPS yönlendirmesi
app.UseHttpsRedirection();

// ✅ CORS politikası aktif (önemli sırayla!)
app.UseCors("AllowFrontend");

app.UseAuthorization();
app.MapControllers();

app.Run();
