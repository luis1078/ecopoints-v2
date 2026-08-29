using EcoPoints.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace EcoPoints.Api.Features.Recompensas;

public record RecompensaDto(Guid Id, string Nombre, string? Descripcion,
                            int PuntosRequeridos, int Stock, string? ImagenUrl);

public static class ListarRecompensas
{
    public static void MapListarRecompensas(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/recompensas", Handle).WithName("ListarRecompensas");
    }

    private static async Task<IResult> Handle(
        EcoPointsDbContext db, CancellationToken ct)
    {
        var items = await db.Recompensas
            .Where(r => r.Activa)
            .OrderBy(r => r.PuntosRequeridos)
            .Select(r => new RecompensaDto(r.Id, r.Nombre, r.Descripcion,
                                           r.PuntosRequeridos, r.Stock, r.ImagenUrl))
            .ToListAsync(ct);

        return Results.Ok(items);
    }
}