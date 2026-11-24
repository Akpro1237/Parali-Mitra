# Production Dockerfile for ParaliMitra Stubble Management Platform
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["parali-mitra.csproj", "./"]
RUN dotnet restore "parali-mitra.csproj"
COPY . .
RUN dotnet build "parali-mitra.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "parali-mitra.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "parali-mitra.dll"]
