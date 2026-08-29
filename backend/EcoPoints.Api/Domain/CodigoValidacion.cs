namespace EcoPoints.Api.Domain;

public class CodigoValidacion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MisionId { get; set; }
    public string Codigo { get; set; } = null!;
    public Guid? UsadoPor { get; set; }
    public DateTime? UsadoEn { get; set; }
    public DateTime? ExpiraEn { get; set; }

    public Mision Mision { get; set; } = null!;
    public Usuario? Usuario { get; set; }
}