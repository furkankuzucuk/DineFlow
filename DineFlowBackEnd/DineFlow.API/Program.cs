using DineFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
// using DineFlow.Infrastructure; // Projenizde varsa buraya ekleyin

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// -------------------------------------------------------------------------

// Mimari servisleri Infrastructure katmanından yükle (Eğer Dependency Injection metodu kullanılıyorsa)
// builder.Services.AddInfrastructure(builder.Configuration);

// JSON döngü hatasını engelle (örneğin Category <-> MenuItem ilişkilerinde)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true; 
    });

// Veritabanı bağlantısı
builder.Services.AddDbContext<DineFlowDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// CORS ayarları (React frontend’e izin veriyoruz)
// ÇÖZÜM: Tüm kaynaklara izin veren geçici politika (Sadece geliştirme için güvenlidir)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin() // Tüm kaynaklara izin ver
              .AllowAnyHeader()  // Tüm başlıklara izin ver
              .AllowAnyMethod();  // Tüm metodlara izin ver
    });
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Geliştirme ortamında kullanmak için ekliyoruz

// -------------------------------------------------------------------------

var app = builder.Build();

// Configure the HTTP request pipeline.
// -------------------------------------------------------------------------

// Güvenlik: Swagger sadece geliştirme ortamında (Development) görünür olmalı.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "DineFlow API v1");
        c.RoutePrefix = string.Empty; // API'nin kök adresinde (http://localhost:5001) Swagger açılır
    });
}


// Docker'da HTTPS gereksinimi genellikle yoktur ve sorun çıkarabilir.
// app.UseHttpsRedirection(); 


// CORS politikası aktif (Middleware'in doğru sırası önemlidir!)
app.UseCors("AllowAllOrigins");

app.UseAuthorization();
app.MapControllers();

app.Run();