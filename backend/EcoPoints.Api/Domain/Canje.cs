namespace EcoPoints.Api.Domain;

public class Canje
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UsuarioId { get; set; }
    public Guid RecompensaId { get; set; }
    public int PuntosGastados { get; set; }
    public string Estado { get; set; } = "pendiente";
    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

    public Usuario Usuario { get; set; } = null!;
    public Recompensa Recompensa { get; set; } = null!;
}