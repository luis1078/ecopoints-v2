using System.Security.Cryptography;
using EcoPoints.Api.Data;
using EcoPoints.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace EcoPoints.Api.Features.Codigos;

public record GenerarCodigosRequest(Guid MisionId, int Cantidad, DateTime? ExpiraEn);

public static class GenerarCodigos
{
    private const string Alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    public static void MapGenerarCodigos(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/codigos/generar", Handle)
           .RequireAuthorization("Admin")
           .WithName("GenerarCodigos");
    }

    private static async Task<IResult> Handle(
        GenerarCodigosRequest req,
        EcoPointsDbContext db,
        CancellationToken ct)
    {
        if (req.Cantidad is < 1 or > 500)
            return Results.BadRequest(new { message = "La cantidad debe estar entre 1 y 500." });

        if (!await db.Misiones.AnyAsync(m => m.Id == req.MisionId, ct))
            return Results.NotFound(new { message = "La misión no existe." });

        var codigos = new List<CodigoValidacion>();
        var generados = new HashSet<string>();

        while (generados.Count < req.Cantidad)
        {
            var codigo = GenerarCodigo();
            if (!generados.Add(codigo)) continue;

            codigos.Add(new CodigoValidacion
            {
                MisionId = req.MisionId,
                Codigo = codigo,
                ExpiraEn = req.ExpiraEn
            });
        }

        db.CodigosValidacion.AddRange(codigos);
        await db.SaveChangesAsync(ct);

        return Results.Ok(new { generados = codigos.Count,
                                codigos = codigos.Select(c => c.Codigo) });
    }

    private static string GenerarCodigo()
    {
        var chars = new char[10];
        for (var i = 0; i < chars.Length; i++)
            chars[i] = Alfabeto[RandomNumberGenerator.GetInt32(Alfabeto.Length)];
        return $"ECO-{new string(chars, 0, 5)}-{new string(chars, 5, 5)}";
    }
}