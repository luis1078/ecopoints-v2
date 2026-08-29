using System.Security.Claims;
using EcoPoints.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace EcoPoints.Api.Features.Canjes;

public record CanjeDto(
    Guid Id, string Recompensa, int PuntosGastados, string Estado, DateTime CreadoEn);

public static class MisCanjes
{
    public static void MapMisCanjes(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/mi/canjes", Handle)
           .RequireAuthorization()
           .WithName("MisCanjes");
    }

    private static async Task<IResult> Handle(
        ClaimsPrincipal user, EcoPointsDbContext db, CancellationToken ct)
    {
        var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)
                                   ?? user.FindFirstValue("sub")!);

        var canjes = await db.Canjes
            .Where(c => c.UsuarioId == usuarioId)
            .OrderByDescending(c => c.CreadoEn)
            .Select(c => new CanjeDto(
                c.Id, c.Recompensa.Nombre, c.PuntosGastados, c.Estado, c.CreadoEn))
            .ToListAsync(ct);

        return Results.Ok(canjes);
    }
}
