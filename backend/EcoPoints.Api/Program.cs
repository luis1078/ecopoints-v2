using System.Text;
using EcoPoints.Api.Auth;
using EcoPoints.Api.Data;
using EcoPoints.Api.Features.Auth;
using EcoPoints.Api.Features.Misiones;
using EcoPoints.Api.Features.Codigos;
using EcoPoints.Api.Features.Usuarios;
using EcoPoints.Api.Features.Canjes;
using EcoPoints.Api.Features.Recompensas;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<EcoPointsDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default"))
       .UseSnakeCaseNamingConvention());

builder.Services.AddScoped<JwtService>();
builder.Services.AddValidatorsFromAssemblyContaining<RegisterValidator>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization(opt =>
    opt.AddPolicy("Admin", p => p.RequireRole("admin")));

builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();

builder.Services.AddCors(opt =>
    opt.AddPolicy("Frontend", p => p
        .WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<EcoPointsDbContext>();
    await SeedData.InicializarAsync(db);
}

app.UseExceptionHandler();
app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapRegister();
app.MapLogin();

app.MapListarMisiones();
app.MapCrearMision();
app.MapValidarCodigo();

app.MapGenerarCodigos();
app.MapMiSaldo();

app.MapListarRecompensas();
app.MapCrearRecompensa();
app.MapCanjearRecompensa();

app.Run();

