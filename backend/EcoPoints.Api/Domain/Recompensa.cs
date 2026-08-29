namespace EcoPoints.Api.Domain;

public class Recompensa
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nombre { get; set; } = null!;
    public string? Descripcion { get; set; }
    public int PuntosRequeridos { get; set; }
    public int Stock { get; set; }
    public string? ImagenUrl { get; set; }
    public bool Activa { get; set; } = true;
}