using System.Security.Claims;
using EcoPoints.Api.Data;
using EcoPoints.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace EcoPoints.Api.Features.Canjes;

public record CanjearRequest(Guid RecompensaId);
public record CanjearResponse(Guid CanjeId, string Recompensa,
                              int PuntosGastados, int SaldoRestante);

public static class CanjearRecompensa
{
    public static void MapCanjearRecompensa(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/canjes", Handle)
           .RequireAuthorization()
           .WithName("CanjearRecompensa");
    }

    private static async Task<IResult> Handle(
        CanjearRequest req,
        ClaimsPrincipal user,
        EcoPointsDbContext db,
        CancellationToken ct)
    {
        var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)
                                   ?? user.FindFirstValue("sub")!);

        await using var tx = await db.Database.BeginTransactionAsync(ct);

        var recompensa = await db.Recompensas
            .FirstOrDefaultAsync(r => r.Id == req.RecompensaId && r.Activa, ct);

        if (recompensa is null)
            return Results.NotFound(new { message = "Recompensa no disponible." });

        var saldo = await db.MovimientosPuntos
            .Where(m => m.UsuarioId == usuarioId)
            .SumAsync(m => m.Puntos, ct);

        if (saldo < recompensa.PuntosRequeridos)
            return Results.BadRequest(new
            {
                message = "Saldo insuficiente.",
                saldo,
                requerido = recompensa.PuntosRequeridos
            });

        // Descuento de stock atómico: solo procede si aún queda.
        var filas = await db.Database.ExecuteSqlInterpolatedAsync($"""
            UPDATE recompensas
            SET stock = stock - 1
            WHERE id = {recompensa.Id} AND stock > 0
            """, ct);

        if (filas == 0)
        {
            await tx.RollbackAsync(ct);
            return Results.Conflict(new { message = "La recompensa se agotó." });
        }

        var canje = new Canje
        {
            UsuarioId = usuarioId,
            RecompensaId = recompensa.Id,
            PuntosGastados = recompensa.PuntosRequeridos,
            Estado = "pendiente"
        };
        db.Canjes.Add(canje);

        db.MovimientosPuntos.Add(new MovimientoPuntos
        {
            UsuarioId = usuarioId,
            Tipo = "canje",
            Puntos = -recompensa.PuntosRequeridos,
            CanjeId = canje.Id,
            Descripcion = $"Canje: {recompensa.Nombre}"
        });

        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);

        return Results.Ok(new CanjearResponse(
            canje.Id, recompensa.Nombre, recompensa.PuntosRequeridos,
            saldo - recompensa.PuntosRequeridos));
    }
}