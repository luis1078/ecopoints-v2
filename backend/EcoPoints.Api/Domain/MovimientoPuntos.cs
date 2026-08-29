namespace EcoPoints.Api.Domain;

public class MovimientoPuntos
{
    public long Id { get; set; }
    public Guid UsuarioId { get; set; }
    public string Tipo { get; set; } = null!;   // ganancia | canje | ajuste
    public int Puntos { get; set; }             // positivo suma, negativo resta
    public Guid? MisionId { get; set; }
    public Guid? CanjeId { get; set; }
    public string? Descripcion { get; set; }
    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

    public Usuario Usuario { get; set; } = null!;
}