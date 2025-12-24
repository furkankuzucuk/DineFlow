
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src


COPY DineFlow.sln .  
COPY DineFlowBackEnd/DineFlow.API/*.csproj ./DineFlow.API/
COPY DineFlowBackEnd/DineFlow.Application/*.csproj ./DineFlow.Application/
COPY DineFlowBackEnd/DineFlow.Domain/*.csproj ./DineFlow.Domain/
COPY DineFlowBackEnd/DineFlow.Infrastructure/*.csproj ./DineFlow.Infrastructure/


RUN dotnet restore

COPY DineFlowBackEnd .


WORKDIR /src/DineFlow.API
RUN dotnet publish "DineFlow.API.csproj" -c Release -o /app/publish /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "DineFlow.API.dll"]