namespace EcoPoints.Api.Domain;

public class Usuario
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string Nombre { get; set; } = null!;
    public string Rol { get; set; } = "usuario";
    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

    public ICollection<MovimientoPuntos> Movimientos { get; set; } = [];
    public ICollection<Canje> Canjes { get; set; } = [];
}