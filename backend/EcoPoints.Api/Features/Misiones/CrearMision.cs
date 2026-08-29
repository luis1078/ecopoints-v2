using EcoPoints.Api.Data;
using EcoPoints.Api.Domain;
using FluentValidation;

namespace EcoPoints.Api.Features.Misiones;

public record CrearMisionRequest(
    string Titulo, string? Descripcion, int Puntos,
    DateTime? VigenteDesde, DateTime? VigenteHasta, int? CupoMaximo);

public class CrearMisionValidator : AbstractValidator<CrearMisionRequest>
{
    public CrearMisionValidator()
    {
        RuleFor(x => x.Titulo).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Puntos).GreaterThan(0);
        RuleFor(x => x.CupoMaximo).GreaterThan(0)
            .When(x => x.CupoMaximo.HasValue);
        RuleFor(x => x.VigenteHasta)
            .GreaterThan(x => x.VigenteDesde)
            .When(x => x.VigenteDesde.HasValue && x.VigenteHasta.HasValue)
            .WithMessage("La fecha de fin debe ser posterior a la de inicio.");
    }
}

public static class CrearMision
{
    public static void MapCrearMision(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/misiones", Handle)
           .RequireAuthorization("Admin")
           .WithName("CrearMision");
    }

    private static async Task<IResult> Handle(
        CrearMisionRequest req,
        EcoPointsDbContext db,
        IValidator<CrearMisionRequest> validator,
        CancellationToken ct)
    {
        var v = await validator.ValidateAsync(req, ct);
        if (!v.IsValid) return Results.ValidationProblem(v.ToDictionary());

        var mision = new Mision
        {
            Titulo = req.Titulo.Trim(),
            Descripcion = req.Descripcion?.Trim(),
            Puntos = req.Puntos,
            VigenteDesde = req.VigenteDesde,
            VigenteHasta = req.VigenteHasta,
            CupoMaximo = req.CupoMaximo
        };

        db.Misiones.Add(mision);
        await db.SaveChangesAsync(ct);

        return Results.Created($"/api/misiones/{mision.Id}", new { mision.Id });
    }
}