using EcoPoints.Api.Auth;
using EcoPoints.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace EcoPoints.Api.Features.Auth;

public record LoginRequest(string Email, string Password);

public static class Login
{
    public static void MapLogin(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/login", Handle)
           .WithName("Login")
           .AllowAnonymous();
    }

    private static async Task<IResult> Handle(
        LoginRequest req,
        EcoPointsDbContext db,
        JwtService jwt,
        CancellationToken ct)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        var usuario = await db.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email, ct);

        if (usuario is null ||
            !BCrypt.Net.BCrypt.Verify(req.Password, usuario.PasswordHash))
            return Results.Unauthorized();

        return Results.Ok(new AuthResponse(
            jwt.GenerarToken(usuario), usuario.Nombre, usuario.Email, usuario.Rol));
    }
}