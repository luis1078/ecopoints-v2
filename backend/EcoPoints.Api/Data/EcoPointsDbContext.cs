using EcoPoints.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace EcoPoints.Api.Data;

public class EcoPointsDbContext(DbContextOptions<EcoPointsDbContext> options)
    : DbContext(options)
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Mision> Misiones => Set<Mision>();
    public DbSet<CodigoValidacion> CodigosValidacion => Set<CodigoValidacion>();
    public DbSet<Recompensa> Recompensas => Set<Recompensa>();
    public DbSet<MovimientoPuntos> MovimientosPuntos => Set<MovimientoPuntos>();
    public DbSet<Canje> Canjes => Set<Canje>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Usuario>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Rol).HasDefaultValue("usuario");
        });

        b.Entity<Mision>(e =>
            e.ToTable(t => t.HasCheckConstraint("ck_misiones_puntos", "puntos > 0")));

        b.Entity<CodigoValidacion>(e =>
        {
            e.HasIndex(c => c.Codigo).IsUnique();
            e.HasOne(c => c.Mision)
             .WithMany(m => m.Codigos)
             .HasForeignKey(c => c.MisionId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(c => c.Usuario)
             .WithMany()
             .HasForeignKey(c => c.UsadoPor)
             .OnDelete(DeleteBehavior.SetNull);
        });

        b.Entity<Recompensa>(e =>
            e.ToTable(t => t.HasCheckConstraint(
                "ck_recompensas_puntos", "puntos_requeridos > 0")));

        b.Entity<MovimientoPuntos>(e =>
        {
            e.HasIndex(m => new { m.UsuarioId, m.CreadoEn });
            e.HasOne(m => m.Usuario)
             .WithMany(u => u.Movimientos)
             .HasForeignKey(m => m.UsuarioId);
        });

        b.Entity<Canje>(e =>
        {
            e.HasOne(c => c.Usuario)
             .WithMany(u => u.Canjes)
             .HasForeignKey(c => c.UsuarioId);
            e.HasOne(c => c.Recompensa)
             .WithMany()
             .HasForeignKey(c => c.RecompensaId);
        });
    }
}