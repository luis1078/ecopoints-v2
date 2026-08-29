using System.Security.Claims;
using EcoPoints.Api.Data;
using EcoPoints.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace EcoPoints.Api.Features.Codigos;

public record ValidarCodigoRequest(string Codigo);
public record ValidarCodigoResponse(string Mision, int PuntosGanados, int SaldoActual);

public static class ValidarCodigo
{
    public static void MapValidarCodigo(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/codigos/validar", Handle)
           .RequireAuthorization()
           .WithName("ValidarCodigo");
    }

    private static async Task<IResult> Handle(
        ValidarCodigoRequest req,
        ClaimsPrincipal user,
        EcoPointsDbContext db,
        CancellationToken ct)
    {
        var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)
                                   ?? user.FindFirstValue("sub")!);

        var codigo = req.Codigo.Trim().ToUpperInvariant();

        await using var tx = await db.Database.BeginTransactionAsync(ct);

        var filas = await db.Database.ExecuteSqlInterpolatedAsync($"""
            UPDATE codigos_validacion
            SET usado_por = {usuarioId}, usado_en = now()
            WHERE codigo = {codigo}
              AND usado_por IS NULL
              AND (expira_en IS NULL OR expira_en > now())
            """, ct);

        if (filas == 0)
        {
            await tx.RollbackAsync(ct);
            return Results.BadRequest(new
            {
                message = "Código inválido, expirado o ya utilizado."
            });
        }

        var mision = await db.CodigosValidacion
            .Where(c => c.Codigo == codigo)
            .Select(c => c.Mision)
            .FirstAsync(ct);

        db.MovimientosPuntos.Add(new MovimientoPuntos
        {
            UsuarioId = usuarioId,
            Tipo = "ganancia",
            Puntos = mision.Puntos,
            MisionId = mision.Id,
            Descripcion = $"Misión completada: {mision.Titulo}"
        });

        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);

        var saldo = await db.MovimientosPuntos
            .Where(m => m.UsuarioId == usuarioId)
            .SumAsync(m => m.Puntos, ct);

        return Results.Ok(new ValidarCodigoResponse(
            mision.Titulo, mision.Puntos, saldo));
    }
}