using EcoPoints.Api.Auth;
using EcoPoints.Api.Data;
using EcoPoints.Api.Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace EcoPoints.Api.Features.Auth;

public record RegisterRequest(string Email, string Password, string Nombre);
public record AuthResponse(string Token, string Nombre, string Email, string Rol);

public class RegisterValidator : AbstractValidator<RegisterRequest>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8)
            .WithMessage("La contraseña debe tener al menos 8 caracteres.");
        RuleFor(x => x.Nombre).NotEmpty().MaximumLength(120);
    }
}

public static class Register
{
    public static void MapRegister(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/register", Handle)
           .WithName("Register")
           .AllowAnonymous();
    }

    private static async Task<IResult> Handle(
        RegisterRequest req,
        EcoPointsDbContext db,
        JwtService jwt,
        IValidator<RegisterRequest> validator,
        CancellationToken ct)
    {
        var validacion = await validator.ValidateAsync(req, ct);
        if (!validacion.IsValid)
            return Results.ValidationProblem(validacion.ToDictionary());

        var email = req.Email.Trim().ToLowerInvariant();

        if (await db.Usuarios.AnyAsync(u => u.Email == email, ct))
            return Results.Conflict(new { message = "El email ya está registrado." });

        var usuario = new Usuario
        {
            Email = email,
            Nombre = req.Nombre.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Rol = "usuario"
        };

        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync(ct);

        return Results.Created($"/api/usuarios/{usuario.Id}",
            new AuthResponse(jwt.GenerarToken(usuario),
                             usuario.Nombre, usuario.Email, usuario.Rol));
    }
}