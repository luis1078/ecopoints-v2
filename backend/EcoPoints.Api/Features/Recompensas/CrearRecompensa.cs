using EcoPoints.Api.Data;
using EcoPoints.Api.Domain;

namespace EcoPoints.Api.Features.Recompensas;

public record CrearRecompensaRequest(string Nombre, string? Descripcion,
                                     int PuntosRequeridos, int Stock, string? ImagenUrl);

public static class CrearRecompensa
{
    public static void MapCrearRecompensa(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/recompensas", Handle)
           .RequireAuthorization("Admin")
           .WithName("CrearRecompensa");
    }

    private static async Task<IResult> Handle(
        CrearRecompensaRequest req, EcoPointsDbContext db, CancellationToken ct)
    {
        if (req.PuntosRequeridos <= 0)
            return Results.BadRequest(new { message = "Los puntos deben ser mayores a cero." });
        if (req.Stock < 0)
            return Results.BadRequest(new { message = "El stock no puede ser negativo." });

        var r = new Recompensa
        {
            Nombre = req.Nombre.Trim(),
            Descripcion = req.Descripcion?.Trim(),
            PuntosRequeridos = req.PuntosRequeridos,
            Stock = req.Stock,
            ImagenUrl = req.ImagenUrl
        };

        db.Recompensas.Add(r);
        await db.SaveChangesAsync(ct);
        return Results.Created($"/api/recompensas/{r.Id}", new { r.Id });
    }
}