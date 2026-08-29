using EcoPoints.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace EcoPoints.Api.Features.Misiones;

public record MisionDto(Guid Id, string Titulo, string? Descripcion, int Puntos);

public static class ListarMisiones
{
    public static void MapListarMisiones(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/misiones", Handle).WithName("ListarMisiones");
    }

    private static async Task<IResult> Handle(
        EcoPointsDbContext db, CancellationToken ct)
    {
        var ahora = DateTime.UtcNow;

        var misiones = await db.Misiones
            .Where(m => m.Activa
                     && (m.VigenteDesde == null || m.VigenteDesde <= ahora)
                     && (m.VigenteHasta == null || m.VigenteHasta >= ahora))
            .OrderBy(m => m.Puntos)
            .Select(m => new MisionDto(m.Id, m.Titulo, m.Descripcion, m.Puntos))
            .ToListAsync(ct);

        return Results.Ok(misiones);
    }
}