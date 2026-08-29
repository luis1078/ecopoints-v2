using EcoPoints.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace EcoPoints.Api.Features.Misiones;

public record MisionDetalleDto(
    Guid Id, string Titulo, string? Descripcion, int Puntos,
    DateTime? VigenteDesde, DateTime? VigenteHasta, int? CupoMaximo);

public static class ObtenerMision
{
    public static void MapObtenerMision(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/misiones/{id:guid}", Handle).WithName("ObtenerMision");
    }

    private static async Task<IResult> Handle(
        Guid id, EcoPointsDbContext db, CancellationToken ct)
    {
        var mision = await db.Misiones
            .Where(m => m.Id == id && m.Activa)
            .Select(m => new MisionDetalleDto(
                m.Id, m.Titulo, m.Descripcion, m.Puntos,
                m.VigenteDesde, m.VigenteHasta, m.CupoMaximo))
            .FirstOrDefaultAsync(ct);

        return mision is null ? Results.NotFound() : Results.Ok(mision);
    }
}
