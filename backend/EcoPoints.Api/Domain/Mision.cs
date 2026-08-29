namespace EcoPoints.Api.Domain;

public class Mision
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Titulo { get; set; } = null!;
    public string? Descripcion { get; set; }
    public int Puntos { get; set; }
    public bool Activa { get; set; } = true;
    public DateTime? VigenteDesde { get; set; }
    public DateTime? VigenteHasta { get; set; }
    public int? CupoMaximo { get; set; }
    public DateTime CreadaEn { get; set; } = DateTime.UtcNow;

    public ICollection<CodigoValidacion> Codigos { get; set; } = [];
}