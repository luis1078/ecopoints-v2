using System.Security.Claims;
using EcoPoints.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace EcoPoints.Api.Features.Usuarios;

public record MovimientoDto(string Tipo, int Puntos, string? Descripcion, DateTime Fecha);
public record SaldoResponse(int Saldo, IEnumerable<MovimientoDto> Movimientos);

public static class MiSaldo
{
    public static void MapMiSaldo(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/mi/saldo", Handle)
           .RequireAuthorization()
           .WithName("MiSaldo");
    }

    private static async Task<IResult> Handle(
        ClaimsPrincipal user, EcoPointsDbContext db, CancellationToken ct)
    {
        var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)
                                   ?? user.FindFirstValue("sub")!);

        var movimientos = await db.MovimientosPuntos
            .Where(m => m.UsuarioId == usuarioId)
            .OrderByDescending(m => m.CreadoEn)
            .Take(50)
            .Select(m => new MovimientoDto(m.Tipo, m.Puntos, m.Descripcion, m.CreadoEn))
            .ToListAsync(ct);

        var saldo = await db.MovimientosPuntos
            .Where(m => m.UsuarioId == usuarioId)
            .SumAsync(m => m.Puntos, ct);

        return Results.Ok(new SaldoResponse(saldo, movimientos));
    }
}