# 1. Aşama: Build (Derleme)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Yollar, ana dizin (context: .) baz alınarak güncellendi.
COPY DineFlow.sln .  
COPY DineFlowBackEnd/DineFlow.API/*.csproj ./DineFlow.API/
COPY DineFlowBackEnd/DineFlow.Application/*.csproj ./DineFlow.Application/
COPY DineFlowBackEnd/DineFlow.Domain/*.csproj ./DineFlow.Domain/
COPY DineFlowBackEnd/DineFlow.Infrastructure/*.csproj ./DineFlow.Infrastructure/

# Tüm bağımlılıkları geri yükle
RUN dotnet restore

# Kalan tüm kaynak kodlarını kopyala
COPY DineFlowBackEnd .

# API projesini release modunda yayımla (publish)
WORKDIR /src/DineFlow.API
RUN dotnet publish "DineFlow.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 2. Aşama: Final (Çalıştırma)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "DineFlow.API.dll"]